const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const DOMAIN = 'gadigitalsolutions.com';

const visitedUrls = new Set();
const urlQueue = [];
const crawlResults = {};
const redirectChains = {};

// Helper to fetch URL
async function fetchUrl(urlStr) {
  const startTime = Date.now();
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(urlStr);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 10000
      }, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';

        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectTarget = res.headers.location;
          try {
            redirectTarget = new URL(res.headers.location, urlStr).href;
          } catch(e) {}
          resolve({
            url: urlStr,
            status: res.statusCode,
            headers: res.headers,
            redirectUrl: redirectTarget,
            responseTime,
            html: ''
          });
          return;
        }

        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            url: urlStr,
            status: res.statusCode,
            headers: res.headers,
            responseTime,
            html: data
          });
        });
      });

      req.on('error', (err) => resolve({ url: urlStr, status: 0, error: err.message, responseTime: Date.now() - startTime, html: '' }));
      req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, status: 408, error: 'Timeout', responseTime: Date.now() - startTime, html: '' }); });
    } catch (err) {
      resolve({ url: urlStr, status: 0, error: err.message, responseTime: Date.now() - startTime, html: '' });
    }
  });
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim().replace(/\s+/g, ' ') : null;
}

function extractMeta(html, nameOrProperty) {
  const reg = new RegExp(`<meta[^>]*?(?:name|property)=["']${nameOrProperty}["'][^>]*?content=["']([^"']*)["']`, 'i');
  const regAlt = new RegExp(`<meta[^>]*?content=["']([^"']*)["'][^>]*?(?:name|property)=["']${nameOrProperty}["']`, 'i');
  const match = html.match(reg) || html.match(regAlt);
  return match ? match[1].trim() : null;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*?rel=["']canonical["'][^>]*?href=["']([^"']*)["']/i);
  return match ? match[1].trim() : null;
}

function extractHeadings(html, tag) {
  const reg = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const headings = [];
  let match;
  while ((match = reg.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (text) headings.push(text);
  }
  return headings;
}

function extractSchemas(html) {
  const reg = /<script[^>]*?type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let match;
  while ((match = reg.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(match[1].trim()));
    } catch (e) {
      schemas.push({ raw: match[1].trim(), parseError: e.message });
    }
  }
  return schemas;
}

function extractImages(html) {
  const reg = /<img[^>]+>/gi;
  const images = [];
  let match;
  while ((match = reg.exec(html)) !== null) {
    const imgTag = match[0];
    const srcMatch = imgTag.match(/src=["']([^"']*)["']/i);
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    if (srcMatch) {
      images.push({
        src: srcMatch[1],
        alt: altMatch ? altMatch[1] : null,
        hasAlt: altMatch !== null && altMatch[1].trim() !== ''
      });
    }
  }
  return images;
}

function extractLinks(html, currentUrl) {
  const reg = /<a[^>]*?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links = [];
  let match;
  while ((match = reg.exec(html)) !== null) {
    const href = match[1].trim();
    const anchorText = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    try {
      const absoluteUrl = new URL(href, currentUrl).href;
      links.push({ href: absoluteUrl, rawHref: href, anchorText });
    } catch (e) {}
  }
  return links;
}

function extractTextContent(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
             .replace(/<style[\s\S]*?<\/style>/gi, ' ')
             .replace(/<[^>]+>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim();
}

async function runCleanAudit() {
  console.log('=== STARTING CLEAN GADS CRAWL ===');
  
  // 1. Fetch robots.txt
  const robotsRes = await fetchUrl('https://gadigitalsolutions.com/robots.txt');
  
  // 2. Fetch sitemap.xml
  const sitemapRes = await fetchUrl('https://gadigitalsolutions.com/sitemap.xml');
  let sitemapUrls = [];
  if (sitemapRes.status === 200 && sitemapRes.html) {
    const locMatches = sitemapRes.html.match(/<loc>([\s\S]*?)<\/loc>/gi);
    if (locMatches) {
      sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());
    }
  }

  console.log(`Found ${sitemapUrls.length} URLs in sitemap.xml.`);

  // Seed queue with sitemap URLs and root pages
  const baseQueue = [
    'https://gadigitalsolutions.com/',
    'https://gadigitalsolutions.com/about',
    'https://gadigitalsolutions.com/services',
    'https://gadigitalsolutions.com/our-works',
    'https://gadigitalsolutions.com/websites',
    'https://gadigitalsolutions.com/design-portfolio',
    'https://gadigitalsolutions.com/careers',
    'https://gadigitalsolutions.com/internships',
    'https://gadigitalsolutions.com/blog',
    'https://gadigitalsolutions.com/contact',
    'https://gadigitalsolutions.com/privacy-policy',
    'https://gadigitalsolutions.com/disclaimer',
    'https://gadigitalsolutions.com/enquiry',
    'https://gadigitalsolutions.com/orm',
    ...sitemapUrls
  ];

  for (const u of baseQueue) {
    try {
      const cleanUrl = new URL(u).href;
      if (!visitedUrls.has(cleanUrl) && !urlQueue.includes(cleanUrl)) {
        urlQueue.push(cleanUrl);
      }
    } catch(e) {}
  }

  while (urlQueue.length > 0) {
    const currentUrl = urlQueue.shift();
    if (visitedUrls.has(currentUrl)) continue;

    // Prevent deep recursive URL loops (max path depth check)
    const urlObj = new URL(currentUrl);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length > 4) {
      console.log(`Skipping deep nested path: ${currentUrl}`);
      continue;
    }

    visitedUrls.add(currentUrl);
    console.log(`Auditing (${visitedUrls.size}): ${currentUrl}`);
    const res = await fetchUrl(currentUrl);

    if (res.status >= 300 && res.status < 400 && res.redirectUrl) {
      redirectChains[currentUrl] = res.redirectUrl;
      crawlResults[currentUrl] = {
        url: currentUrl,
        status: res.status,
        redirectUrl: res.redirectUrl,
        responseTime: res.responseTime
      };
      // If redirect target is in domain, queue it if not visited
      try {
        const dest = new URL(res.redirectUrl, currentUrl).href;
        if (dest.includes(DOMAIN) && !visitedUrls.has(dest) && !urlQueue.includes(dest)) {
          urlQueue.push(dest);
        }
      } catch(e) {}
      continue;
    }

    if (res.status !== 200) {
      crawlResults[currentUrl] = {
        url: currentUrl,
        status: res.status,
        error: res.error || `HTTP ${res.status}`,
        responseTime: res.responseTime
      };
      continue;
    }

    const title = extractTitle(res.html);
    const metaDesc = extractMeta(res.html, 'description');
    const metaRobots = extractMeta(res.html, 'robots');
    const viewport = extractMeta(res.html, 'viewport');
    const canonical = extractCanonical(res.html);
    const h1s = extractHeadings(res.html, 'h1');
    const h2s = extractHeadings(res.html, 'h2');
    const h3s = extractHeadings(res.html, 'h3');
    const schemas = extractSchemas(res.html);
    const images = extractImages(res.html);
    const links = extractLinks(res.html, currentUrl);
    const textContent = extractTextContent(res.html);
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;

    const internalLinks = [];
    const externalLinks = [];

    for (const link of links) {
      try {
        const parsedLink = new URL(link.href);
        if (parsedLink.hostname === DOMAIN || parsedLink.hostname === `www.${DOMAIN}`) {
          internalLinks.push(link);
          const normUrl = parsedLink.href.split('#')[0];
          // Only queue clean links (avoid queueing .php if already redirected or relative paths without leading slash)
          if (!visitedUrls.has(normUrl) && !urlQueue.includes(normUrl) && normUrl.startsWith('http')) {
            const pParts = parsedLink.pathname.split('/').filter(Boolean);
            if (pParts.length <= 4) {
              urlQueue.push(normUrl);
            }
          }
        } else {
          externalLinks.push(link);
        }
      } catch(e) {}
    }

    const hasHyderabad = /hyderabad/i.test(textContent);
    const hasPhone = /\+91|tel:|phone/i.test(res.html);
    const hasContactForm = /<form/i.test(res.html);
    const hasWhatsApp = /api\.whatsapp\.com|wa\.me/i.test(res.html);

    crawlResults[currentUrl] = {
      url: currentUrl,
      status: res.status,
      responseTime: res.responseTime,
      title,
      titleLength: title ? title.length : 0,
      metaDesc,
      metaDescLength: metaDesc ? metaDesc.length : 0,
      metaRobots,
      viewport,
      canonical,
      canonicalMatch: canonical ? (canonical === currentUrl || canonical === currentUrl + '/' || canonical + '/' === currentUrl) : false,
      h1s,
      h1Count: h1s.length,
      h2Count: h2s.length,
      h3Count: h3s.length,
      h2s,
      h3s,
      wordCount,
      schemasCount: schemas.length,
      schemas,
      imagesCount: images.length,
      imagesMissingAltCount: images.filter(i => !i.hasAlt).length,
      imagesMissingAlt: images.filter(i => !i.hasAlt).map(i => i.src),
      internalOutboundCount: internalLinks.length,
      externalOutboundCount: externalLinks.length,
      hasHyderabad,
      hasPhone,
      hasContactForm,
      hasWhatsApp,
      inSitemap: sitemapUrls.includes(currentUrl) || sitemapUrls.includes(currentUrl + '/')
    };
  }

  const reportPath = path.join(__dirname, 'clean_audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    robotsTxt: robotsRes.html,
    robotsStatus: robotsRes.status,
    sitemapUrls,
    sitemapStatus: sitemapRes.status,
    redirectChains,
    pagesCount: Object.keys(crawlResults).length,
    pages: crawlResults
  }, null, 2));

  console.log(`\n=== Audit Finished! Saved clean report with ${Object.keys(crawlResults).length} pages to ${reportPath} ===`);
}

runCleanAudit().catch(err => console.error('Clean Audit Error:', err));

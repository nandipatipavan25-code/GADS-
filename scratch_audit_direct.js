const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function fetchUrl(urlStr) {
  const startTime = Date.now();
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(urlStr);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
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

function extractTextContent(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
             .replace(/<style[\s\S]*?<\/style>/gi, ' ')
             .replace(/<[^>]+>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim();
}

async function runDirectAudit() {
  console.log('--- Fetching robots.txt ---');
  const robotsRes = await fetchUrl('https://gadigitalsolutions.com/robots.txt');

  console.log('--- Fetching sitemap.xml ---');
  const sitemapRes = await fetchUrl('https://gadigitalsolutions.com/sitemap.xml');
  let sitemapUrls = [];
  if (sitemapRes.status === 200 && sitemapRes.html) {
    const locMatches = sitemapRes.html.match(/<loc>([\s\S]*?)<\/loc>/gi);
    if (locMatches) {
      sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());
    }
  }

  // Core set of URLs to audit directly
  const targetUrls = Array.from(new Set([
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
    'https://gadigitalsolutions.com/services/brandidentities',
    'https://gadigitalsolutions.com/services/website-development',
    'https://gadigitalsolutions.com/services/website-redesign-services',
    'https://gadigitalsolutions.com/services/website-maintenance-services',
    'https://gadigitalsolutions.com/services/website-malware-removal',
    'https://gadigitalsolutions.com/services/web-application',
    'https://gadigitalsolutions.com/services/mobile-applications',
    'https://gadigitalsolutions.com/services/content-development',
    'https://gadigitalsolutions.com/services/seo',
    'https://gadigitalsolutions.com/services/smm',
    'https://gadigitalsolutions.com/services/sem',
    'https://gadigitalsolutions.com/services/sms-marketing-services',
    'https://gadigitalsolutions.com/services/email-marketing',
    'https://gadigitalsolutions.com/services/whatsapp-marketing',
    'https://gadigitalsolutions.com/services/inside-sales',
    'https://gadigitalsolutions.com/services/customer-support',
    'https://gadigitalsolutions.com/services/customer-engagement',
    'https://gadigitalsolutions.com/services/website-services-hyderabad',
    'https://gadigitalsolutions.com/services/application-development-hyderabad',
    'https://gadigitalsolutions.com/services/content-marketing',
    'https://gadigitalsolutions.com/services/performance-marketing-hyderabad',
    'https://gadigitalsolutions.com/services/lead-generation',
    // Testing legacy / broken / redirect candidates
    'https://gadigitalsolutions.com/index.php',
    'https://gadigitalsolutions.com/about.php',
    'https://gadigitalsolutions.com/contact.php',
    'https://gadigitalsolutions.com/services.php',
    'https://gadigitalsolutions.com/blog.php',
    'https://gadigitalsolutions.com/coming_soon',
    'http://gadigitalsolutions.com/',
    'https://www.gadigitalsolutions.com/',
    ...sitemapUrls
  ]));

  console.log(`Auditing ${targetUrls.length} distinct target URLs...`);

  const pagesData = {};

  for (let i = 0; i < targetUrls.length; i++) {
    const u = targetUrls[i];
    console.log(`[${i+1}/${targetUrls.length}] Auditing: ${u}`);
    const res = await fetchUrl(u);

    if (res.status >= 300 && res.status < 400) {
      pagesData[u] = {
        url: u,
        status: res.status,
        redirectUrl: res.redirectUrl,
        responseTime: res.responseTime
      };
      continue;
    }

    if (res.status !== 200) {
      pagesData[u] = {
        url: u,
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
    const textContent = extractTextContent(res.html);
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;

    const hasHyderabad = /hyderabad/i.test(textContent);
    const hasPhone = /\+91|tel:|phone/i.test(res.html);
    const hasContactForm = /<form/i.test(res.html);
    const hasWhatsApp = /api\.whatsapp\.com|wa\.me/i.test(res.html);

    // Detect internal link formatting (e.g. href ending in .php)
    const phpLinksMatch = res.html.match(/href=["'][^"']*\.php["']/gi);
    const phpLinksCount = phpLinksMatch ? phpLinksMatch.length : 0;

    const relativeLinksNoSlashMatch = res.html.match(/href=["'](?!https?:\/\/|\/|#|javascript:|mailto:|tel:)[^"']+["']/gi);
    const relativeLinksNoSlashCount = relativeLinksNoSlashMatch ? relativeLinksNoSlashMatch.length : 0;

    pagesData[u] = {
      url: u,
      status: res.status,
      responseTime: res.responseTime,
      title,
      titleLength: title ? title.length : 0,
      metaDesc,
      metaDescLength: metaDesc ? metaDesc.length : 0,
      metaRobots,
      viewport,
      canonical,
      canonicalMatch: canonical ? (canonical === u || canonical === u + '/' || canonical + '/' === u) : false,
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
      phpLinksCount,
      relativeLinksNoSlashCount,
      hasHyderabad,
      hasPhone,
      hasContactForm,
      hasWhatsApp,
      inSitemap: sitemapUrls.includes(u) || sitemapUrls.includes(u + '/')
    };
  }

  const resultObj = {
    robotsTxt: robotsRes.html,
    robotsStatus: robotsRes.status,
    sitemapUrls,
    sitemapStatus: sitemapRes.status,
    totalAudited: Object.keys(pagesData).length,
    pages: pagesData
  };

  fs.writeFileSync('final_audit_data.json', JSON.stringify(resultObj, null, 2));
  console.log('Saved final_audit_data.json successfully!');
}

runDirectAudit().catch(err => console.error(err));

const fs = require('fs');
const https = require('https');
const http = require('http');

async function fetchUrl(urlStr) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(urlStr);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (res) => {
        let data = '';
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve({ status: res.statusCode, redirect: res.headers.location, html: '' });
          return;
        }
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, html: data }));
      });
      req.on('error', err => resolve({ status: 0, error: err.message, html: '' }));
    } catch(e) {
      resolve({ status: 0, error: e.message, html: '' });
    }
  });
}

async function inspectMaintenancePage() {
  console.log('=== INSPECTING WEBSITE MAINTENANCE PAGE ===');
  
  const url1 = 'https://gadigitalsolutions.com/services/website-maintenance';
  const url2 = 'https://gadigitalsolutions.com/services/website-maintenance-services';

  console.log(`Fetching ${url1}...`);
  const res1 = await fetchUrl(url1);
  console.log(`Status ${url1}:`, res1.status, res1.redirect ? `-> ${res1.redirect}` : '');

  console.log(`Fetching ${url2}...`);
  const res2 = await fetchUrl(url2);
  console.log(`Status ${url2}:`, res2.status, res2.redirect ? `-> ${res2.redirect}` : '');

  const activeHtml = res1.html || res2.html;
  if (activeHtml) {
    fs.writeFileSync('maintenance_page_raw.html', activeHtml);
    console.log('Saved raw HTML to maintenance_page_raw.html');

    // Extract page elements
    const titleMatch = activeHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const h1Match = activeHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
    const h2Matches = activeHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
    const formCount = (activeHtml.match(/<form/gi) || []).length;
    const tableCount = (activeHtml.match(/<table/gi) || []).length;
    const priceMentions = (activeHtml.match(/₹|\$|price|pricing|package|cost/gi) || []).length;
    const faqMentions = /faq|frequently asked/i.test(activeHtml);
    const testimonialMentions = /testimonial|review|client say|case study/i.test(activeHtml);

    console.log('\n--- PAGE CONTENT HIGHLIGHTS ---');
    console.log('Title:', titleMatch ? titleMatch[1].trim() : 'None');
    console.log('H1 Tags:', h1Match);
    console.log('H2 Count:', h2Matches ? h2Matches.length : 0);
    console.log('H2 List:', h2Matches ? h2Matches.map(h => h.replace(/<[^>]+>/g, '').trim()) : []);
    console.log('Form Count:', formCount);
    console.log('Pricing Tables:', tableCount);
    console.log('Pricing Mentions:', priceMentions);
    console.log('Has FAQ Section:', faqMentions);
    console.log('Has Testimonials / Case Studies:', testimonialMentions);
  }
}

inspectMaintenancePage().catch(err => console.error(err));

const fs = require('fs');
const https = require('https');

async function getPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve(d));
    });
  });
}

async function inspectBlogs() {
  console.log('=== INSPECTING BLOG LISTING & DETAIL PAGES ===');
  
  const mainBlogHtml = await getPage('https://gadigitalsolutions.com/blog');
  const detail1Html = await getPage('https://gadigitalsolutions.com/blogs/ecommerce-website-maintenance');
  const detail2Html = await getPage('https://gadigitalsolutions.com/blogs/website-design-cost-india');
  const detail3Html = await getPage('https://gadigitalsolutions.com/blogs/what-is-web-development');

  console.log('\n--- 1. BLOG LISTING PAGE (/blog) ---');
  console.log('Length:', mainBlogHtml.length);
  console.log('Form count:', (mainBlogHtml.match(/<form/gi) || []).length);
  console.log('WhatsApp links:', (mainBlogHtml.match(/wa\.me|whatsapp/gi) || []).length);
  console.log('Enquiry/Quote CTA buttons:', (mainBlogHtml.match(/href=["'][^"']*(?:enquiry|contact|quote|consultation)[^"']*["']/gi) || []));

  console.log('\n--- 2. BLOG DETAIL PAGE 1 (ecommerce-website-maintenance) ---');
  console.log('Form count in article:', (detail1Html.match(/<form/gi) || []).length);
  console.log('Has sticky CTA banner:', /sticky|fixed-bottom/i.test(detail1Html));
  console.log('Has in-article CTA boxes:', /cta-box|banner-cta|get-quote|book-consultation/i.test(detail1Html));
  console.log('Internal links to /services/:', (detail1Html.match(/href=["'][^"']*services[^"']*["']/gi) || []));
  console.log('Has lead magnet / downloadable checklist:', /download|pdf|checklist|ebook/i.test(detail1Html));
  console.log('Has author bio & trust badges:', /author|written by|reviewed by/i.test(detail1Html));
  console.log('Has WhatsApp click button in article:', /wa\.me|whatsapp/i.test(detail1Html));

  console.log('\n--- 3. BLOG DETAIL PAGE 2 (website-design-cost-india) ---');
  console.log('Form count:', (detail2Html.match(/<form/gi) || []).length);
  console.log('Internal links to /services/:', (detail2Html.match(/href=["'][^"']*services[^"']*["']/gi) || []));

  // Extract snippet of article end / footer of detail1
  const endArticleMatch = detail1Html.match(/<article[\s\S]*?<\/article>/i) || detail1Html.match(/<main[\s\S]*?<\/main>/i);
  if (endArticleMatch) {
    console.log('\n--- Article Content Snippet (End of Post) ---');
    console.log(endArticleMatch[0].slice(-1500));
  }
}

inspectBlogs().catch(err => console.error(err));

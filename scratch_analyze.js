const fs = require('fs');

if (!fs.existsSync('final_audit_data.json')) {
  console.log('final_audit_data.json does not exist yet.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync('final_audit_data.json', 'utf8'));

console.log('=== GADS AUDIT DATA SUMMARY ===');
console.log(`Robots.txt status: ${data.robotsStatus}`);
console.log(`Robots.txt content preview:\n${data.robotsTxt}`);
console.log(`Sitemap.xml status: ${data.sitemapStatus}`);
console.log(`Sitemap URL count: ${data.sitemapUrls ? data.sitemapUrls.length : 0}`);

const pages = data.pages;
const totalPages = Object.keys(pages).length;
console.log(`Total URLs audited: ${totalPages}`);

let status200 = 0;
let status301 = 0;
let status404 = 0;
let status409 = 0;
let status5xx = 0;
let statusOther = 0;

let missingTitle = [];
let shortTitle = [];
let missingMetaDesc = [];
let missingH1 = [];
let multipleH1 = [];
let missingViewport = [];
let missingCanonical = [];
let canonicalMismatch = [];
let missingAltImagesTotal = 0;
let totalImagesCount = 0;
let phpLinksPages = [];
let zeroSchemas = [];
let thinContent = []; // wordCount < 300
let redirectList = [];

for (const [url, info] of Object.entries(pages)) {
  if (info.status === 200) {
    status200++;
    if (!info.title) missingTitle.push(url);
    else if (info.titleLength < 30 || info.titleLength > 65) shortTitle.push({ url, title: info.title, len: info.titleLength });

    if (!info.metaDesc) missingMetaDesc.push(url);

    if (info.h1Count === 0) missingH1.push(url);
    else if (info.h1Count > 1) multipleH1.push({ url, h1s: info.h1s });

    if (!info.viewport) missingViewport.push(url);

    if (!info.canonical) missingCanonical.push(url);
    else if (!info.canonicalMatch) canonicalMismatch.push({ url, canonical: info.canonical });

    totalImagesCount += info.imagesCount || 0;
    missingAltImagesTotal += info.imagesMissingAltCount || 0;

    if (info.phpLinksCount > 0) phpLinksPages.push({ url, count: info.phpLinksCount });

    if (info.schemasCount === 0) zeroSchemas.push(url);

    if (info.wordCount < 300) thinContent.push({ url, wordCount: info.wordCount, title: info.title });
  } else if (info.status >= 300 && info.status < 400) {
    status301++;
    redirectList.push({ url, status: info.status, target: info.redirectUrl });
  } else if (info.status === 404) {
    status404++;
  } else if (info.status === 409) {
    status409++;
  } else if (info.status >= 500) {
    status5xx++;
  } else {
    statusOther++;
  }
}

const summary = {
  robotsStatus: data.robotsStatus,
  robotsTxt: data.robotsTxt,
  sitemapStatus: data.sitemapStatus,
  sitemapCount: data.sitemapUrls ? data.sitemapUrls.length : 0,
  sitemapUrls: data.sitemapUrls,
  totalPages,
  status200,
  status301,
  status404,
  status409,
  status5xx,
  statusOther,
  missingTitle,
  shortTitle,
  missingMetaDesc,
  missingH1,
  multipleH1,
  missingViewport,
  missingCanonical,
  canonicalMismatch,
  totalImagesCount,
  missingAltImagesTotal,
  phpLinksPages,
  zeroSchemas,
  thinContent,
  redirectList
};

fs.writeFileSync('audit_summary_processed.json', JSON.stringify(summary, null, 2));
console.log('Saved audit_summary_processed.json successfully!');

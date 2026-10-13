const { execSync } = require('child_process');
const fs = require('fs');

const urls = [
  'https://gadigitalsolutions.com/',
  'https://gadigitalsolutions.com/about',
  'https://gadigitalsolutions.com/services/seo',
  'https://gadigitalsolutions.com/contact'
];

console.log('Running Lighthouse CLI tests...');

const results = {};

for (const url of urls) {
  console.log(`Auditing with Lighthouse: ${url}`);
  try {
    const filename = url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_') + '.json';
    execSync(`npx lighthouse ${url} --output=json --output-path=./${filename} --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo`, { stdio: 'inherit' });
    
    if (fs.existsSync(filename)) {
      const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
      results[url] = {
        performanceScore: data.categories.performance ? Math.round(data.categories.performance.score * 100) : null,
        accessibilityScore: data.categories.accessibility ? Math.round(data.categories.accessibility.score * 100) : null,
        seoScore: data.categories.seo ? Math.round(data.categories.seo.score * 100) : null,
        bestPracticesScore: data.categories['best-practices'] ? Math.round(data.categories['best-practices'].score * 100) : null,
        fcp: data.audits['first-contentful-paint'] ? data.audits['first-contentful-paint'].displayValue : null,
        lcp: data.audits['largest-contentful-paint'] ? data.audits['largest-contentful-paint'].displayValue : null,
        cls: data.audits['cumulative-layout-shift'] ? data.audits['cumulative-layout-shift'].displayValue : null,
        tbt: data.audits['total-blocking-time'] ? data.audits['total-blocking-time'].displayValue : null,
        speedIndex: data.audits['speed-index'] ? data.audits['speed-index'].displayValue : null,
        auditDetails: {
          viewport: data.audits['viewport'] ? data.audits['viewport'].score === 1 : null,
          fontSize: data.audits['font-size'] ? data.audits['font-size'].score === 1 : null,
          tapTargets: data.audits['tap-targets'] ? data.audits['tap-targets'].score === 1 : null,
          contrast: data.audits['color-contrast'] ? data.audits['color-contrast'].score === 1 : null,
          structuredData: data.audits['structured-data'] ? data.audits['structured-data'].score === 1 : null,
        }
      };
    }
  } catch (e) {
    console.error(`Error running Lighthouse on ${url}:`, e.message);
  }
}

fs.writeFileSync('lighthouse_summary.json', JSON.stringify(results, null, 2));
console.log('Lighthouse auditing complete!');

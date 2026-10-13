const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.querySelectorAll('.scroll-reveal, .stagger-reveal, .text-reveal-line').forEach(el => {
      el.classList.add('is-revealed', 'revealed');
    });
  });

  const servicesEl = await page.$('#services');
  if (servicesEl) {
    await servicesEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    const outPath = path.join(__dirname, 'v1_3d_services_icons.png');
    await servicesEl.screenshot({ path: outPath });
    const artifactPath = 'C:\\Users\\gades\\.gemini\\antigravity\\brain\\57e80b51-ae69-4717-b657-345f60255a3a\\v1_3d_services_icons.png';
    fs.copyFileSync(outPath, artifactPath);
  }

  console.log('Sharp V1 3D Services Icons screenshot saved & copied!');
  await browser.close();
})();

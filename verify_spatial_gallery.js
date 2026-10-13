const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  // Wait 1.2s for WebGL textures to upload and render
  await new Promise(r => setTimeout(r, 1200));

  const outPath = path.join(__dirname, 'v1_hero_portfolio_gallery.png');
  await page.screenshot({
    path: outPath,
    clip: { x: 0, y: 0, width: 1440, height: 860 }
  });

  const artifactPath = 'C:\\Users\\gades\\.gemini\\antigravity\\brain\\57e80b51-ae69-4717-b657-345f60255a3a\\v1_hero_portfolio_gallery.png';
  fs.copyFileSync(outPath, artifactPath);

  console.log('3D Spatial Gallery screenshot captured!');
  await browser.close();
})();

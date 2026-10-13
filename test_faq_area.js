const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 1100 });
  await page.goto('file:///' + path.resolve('ref_v2.jpg').replace(/\\/g, '/'));

  // In ref_v2.jpg (682x1024), where is the question mark?
  // Let's test a couple clips
  await page.screenshot({
    path: 'test_faq_area.png',
    clip: { x: 30, y: 480, width: 250, height: 260 }
  });

  console.log('Test area saved');
  await browser.close();
})();

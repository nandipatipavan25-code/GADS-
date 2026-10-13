const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 1100 });
  await page.goto('file:///' + path.resolve('ref_v2.jpg').replace(/\\/g, '/'));

  // Question mark exact bounding box in ref_v2.jpg:
  // x: 195 to 305 (width 110), y: 585 to 730 (height 145)
  await page.screenshot({
    path: 'v2_faq_question_mark.png',
    clip: { x: 195, y: 585, width: 110, height: 145 }
  });

  console.log('Clean crop saved');
  await browser.close();
})();

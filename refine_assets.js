const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const refPath = path.resolve(__dirname, 'ref_v2.jpg').replace(/\\/g, '/');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#000;">
        <img id="ref" src="file:///${refPath}" style="display:block;margin:0;padding:0;">
      </body>
    </html>
  `, { waitUntil: 'load' });

  // Recrop FAQ 3D question mark cleanly, skipping the white card edge above it (y starts at 512)
  await page.screenshot({
    path: path.join(__dirname, 'v2_faq_question_mark.png'),
    clip: { x: 55, y: 512, width: 110, height: 175 }
  });

  console.log('Question mark recropped cleanly!');
  await browser.close();
})();

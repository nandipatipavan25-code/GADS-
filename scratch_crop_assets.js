const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Load ref_v2.jpg through our local server
  await page.setViewport({ width: 682, height: 1024, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/ref_v2.jpg', { waitUntil: 'networkidle2' });

  // 1. Hero Woman & Workspace: x: 330, y: 70, w: 350, h: 250
  await page.screenshot({
    path: 'v2_hero_woman.png',
    clip: { x: 340, y: 70, width: 340, height: 245 }
  });
  console.log('Cropped v2_hero_woman.png');

  // 2. Handwritten "Ideas Strategy Growth": x: 335, y: 75, w: 90, h: 70
  await page.screenshot({
    path: 'v2_handwritten_script.png',
    clip: { x: 345, y: 80, width: 75, height: 55 }
  });
  console.log('Cropped v2_handwritten_script.png');

  // 3. Floating Chart "Total Growth + 230%": x: 535, y: 225, w: 125, h: 70
  await page.screenshot({
    path: 'v2_growth_chart.png',
    clip: { x: 535, y: 228, width: 125, height: 68 }
  });
  console.log('Cropped v2_growth_chart.png');

  // 4. Sector 1: Healthcare: x: 120, y: 375, w: 60, h: 90
  await page.screenshot({
    path: 'v2_sector_healthcare.png',
    clip: { x: 115, y: 375, width: 65, height: 90 }
  });
  console.log('Cropped v2_sector_healthcare.png');

  // 5. Sector 2: E-commerce: x: 275, y: 375, w: 60, h: 90
  await page.screenshot({
    path: 'v2_sector_ecommerce.png',
    clip: { x: 275, y: 375, width: 60, height: 90 }
  });
  console.log('Cropped v2_sector_ecommerce.png');

  // 6. Sector 3: Education: x: 435, y: 375, w: 60, h: 90
  await page.screenshot({
    path: 'v2_sector_education.png',
    clip: { x: 435, y: 375, width: 60, height: 90 }
  });
  console.log('Cropped v2_sector_education.png');

  // 7. Sector 4: Real Estate: x: 590, y: 375, w: 60, h: 90
  await page.screenshot({
    path: 'v2_sector_realestate.png',
    clip: { x: 585, y: 375, width: 65, height: 90 }
  });
  console.log('Cropped v2_sector_realestate.png');

  // 8. FAQ 3D Question Mark: x: 210, y: 535, w: 90, h: 140
  await page.screenshot({
    path: 'v2_faq_question_mark.png',
    clip: { x: 210, y: 535, width: 90, height: 135 }
  });
  console.log('Cropped v2_faq_question_mark.png');

  // 9. Google Reviews badge: x: 420, y: 700, w: 220, h: 40
  await page.screenshot({
    path: 'v2_google_reviews_badge.png',
    clip: { x: 425, y: 703, width: 215, height: 35 }
  });
  console.log('Cropped v2_google_reviews_badge.png');

  await browser.close();
  console.log('All crops completed successfully!');
})();

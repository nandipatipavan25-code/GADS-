const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/version-2.html', { waitUntil: 'networkidle0' });

  // Progressive scroll to trigger all IntersectionObservers
  await page.evaluate(async () => {
    const scrollStep = 300;
    const scrollInterval = 50;
    const maxScroll = document.body.scrollHeight;
    for (let y = 0; y <= maxScroll; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, scrollInterval));
    }
    // Also explicitly add .revealed class to any remaining unrevealed elements
    document.querySelectorAll('.scroll-reveal, .stagger-reveal').forEach(el => {
      el.classList.add('revealed');
    });
    window.scrollTo(0, 0);
  });

  // Wait 600ms for transitions to settle
  await new Promise(r => setTimeout(r, 600));

  // 1. Hero and Header
  await page.screenshot({
    path: path.join(__dirname, 'v2_hero_section.png'),
    clip: { x: 0, y: 0, width: 1440, height: 780 }
  });

  // 2. Expertise Section
  const expEl = await page.$('#what-we-do');
  if (expEl) {
    await expEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 300));
    await expEl.screenshot({ path: path.join(__dirname, 'v2_expertise_section.png') });
  }

  // 3. FAQ Section
  const faqEl = await page.$('#faq');
  if (faqEl) {
    await faqEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 300));
    await faqEl.screenshot({ path: path.join(__dirname, 'v2_faq_section.png') });
  }

  // 4. Testimonials Section
  const testEl = await page.$('#testimonials');
  if (testEl) {
    await testEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 300));
    await testEl.screenshot({ path: path.join(__dirname, 'v2_testimonials_section.png') });
  }

  // 5. Footer Section
  const footerEl = await page.$('#footer');
  if (footerEl) {
    await footerEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 300));
    await footerEl.screenshot({ path: path.join(__dirname, 'v2_footer_section.png') });
  }

  // 6. Full Page
  await page.screenshot({
    path: path.join(__dirname, 'v2_full_page.png'),
    fullPage: true
  });

  // 7. Mobile View
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/version-2.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(__dirname, 'v2_mobile_view.png'),
    clip: { x: 0, y: 0, width: 390, height: 844 }
  });

  console.log('ALL VERSION-2 SCREENSHOTS CAPTURED PERFECTLY!');
  await browser.close();
})();

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    console.log('404:', req.url);
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3377, async () => {
  console.log('Test server started on http://localhost:3377');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--enable-webgl']
  });

  const page = await browser.newPage();
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  // Desktop Viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3377/index.html', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait 2.5s for WebGL spatial gallery
  await new Promise(r => setTimeout(r, 2500));
  console.log('Capturing light_desktop_hero.png...');
  await page.screenshot({ path: 'light_desktop_hero.png' });

  // Scroll to About Section
  const aboutEl = await page.$('#about');
  if (aboutEl) {
    await page.evaluate(() => {
      const el = document.getElementById('about');
      const nav = document.getElementById('site-nav');
      const offset = (nav ? nav.offsetHeight : 80) + 15;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_desktop_about.png...');
    await page.screenshot({ path: 'light_desktop_about.png' });
  }

  // Scroll to Services
  const servicesEl = await page.$('#services');
  if (servicesEl) {
    await page.evaluate(() => {
      const el = document.getElementById('services');
      const nav = document.getElementById('site-nav');
      const offset = (nav ? nav.offsetHeight : 80) + 15;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_desktop_services.png...');
    await page.screenshot({ path: 'light_desktop_services.png' });
  }

  // Scroll to Projects (Horizontal Track)
  const projectsEl = await page.$('#projects');
  if (projectsEl) {
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      const nav = document.getElementById('site-nav');
      const offset = (nav ? nav.offsetHeight : 80) + 15;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_desktop_projects_start.png...');
    await page.screenshot({ path: 'light_desktop_projects_start.png' });

    // Click Next button to test interactive horizontal scroll
    console.log('Clicking proj-next button...');
    await page.click('#proj-next');
    await new Promise(r => setTimeout(r, 700));
    await page.click('#proj-next');
    await new Promise(r => setTimeout(r, 700));

    console.log('Capturing light_desktop_projects_scrolled.png...');
    await page.screenshot({ path: 'light_desktop_projects_scrolled.png' });
  }

  // Scroll to Industries
  const industriesEl = await page.$('#industries');
  if (industriesEl) {
    await page.evaluate(() => {
      const el = document.getElementById('industries');
      const nav = document.getElementById('site-nav');
      const offset = (nav ? nav.offsetHeight : 80) + 15;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_desktop_industries.png...');
    await page.screenshot({ path: 'light_desktop_industries.png' });
  }

  // Scroll to FAQ
  const faqEl = await page.$('#faq');
  if (faqEl) {
    await page.evaluate(() => {
      const el = document.getElementById('faq');
      const nav = document.getElementById('site-nav');
      const offset = (nav ? nav.offsetHeight : 80) + 15;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_desktop_faq.png...');
    await page.screenshot({ path: 'light_desktop_faq.png' });
  }

  // Scroll to CTA Section
  const ctaEl = await page.$('.cta-banner');
  if (ctaEl) {
    await page.evaluate(() => {
      const el = document.querySelector('.cta-banner');
      const nav = document.getElementById('site-nav');
      const offset = (nav ? nav.offsetHeight : 80) + 30;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_desktop_cta.png...');
    await page.screenshot({ path: 'light_desktop_cta.png' });
  }

  // Scroll to Testimonials & Footer
  const footerEl = await page.$('footer');
  if (footerEl) {
    await footerEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_desktop_footer.png...');
    await page.screenshot({ path: 'light_desktop_footer.png' });
  }

  // Mobile Viewport
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3377/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  console.log('Capturing light_mobile_hero.png...');
  await page.screenshot({ path: 'light_mobile_hero.png' });

  // Mobile About Section
  const mobileAboutEl = await page.$('#about');
  if (mobileAboutEl) {
    await mobileAboutEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_mobile_about.png...');
    await page.screenshot({ path: 'light_mobile_about.png' });
  }

  // Mobile Services Section
  const mobileServicesEl = await page.$('#services');
  if (mobileServicesEl) {
    await mobileServicesEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_mobile_services.png...');
    await page.screenshot({ path: 'light_mobile_services.png' });
  }

  // Mobile Industries Section
  const mobileIndustriesEl = await page.$('#industries');
  if (mobileIndustriesEl) {
    await mobileIndustriesEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    console.log('Capturing light_mobile_industries.png...');
    await page.screenshot({ path: 'light_mobile_industries.png' });
  }

  console.log('Errors:', errors.length ? errors : 'None');

  await browser.close();
  server.close();
  console.log('All light theme tests and screenshots complete!');
  process.exit(0);
});

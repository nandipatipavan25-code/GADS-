const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Simple static server
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4'
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
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3344, async () => {
  console.log('Static server listening on http://localhost:3344');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--enable-webgl']
  });

  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  // Desktop Viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log('Navigating to http://localhost:3344/index.html...');
  await page.goto('http://localhost:3344/index.html', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait 2.5s for 3D Spatial Gallery planes to load & position
  await new Promise(r => setTimeout(r, 2500));

  console.log('Taking Desktop Hero Screenshot...');
  await page.screenshot({ path: 'variant1_desktop_hero.png' });

  // Maintenance section
  const maintEl = await page.$('#maintenance');
  if (maintEl) {
    console.log('Taking Maintenance Section Screenshot...');
    await maintEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'variant1_desktop_maintenance.png' });
  }

  // Web Design & Bento
  const designEl = await page.$('#web-design');
  if (designEl) {
    console.log('Taking Web Design Bento Screenshot...');
    await designEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'variant1_desktop_services.png' });
  }

  // Work section
  const workEl = await page.$('#work');
  if (workEl) {
    console.log('Taking Selected Work Screenshot...');
    await workEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'variant1_desktop_work.png' });
  }

  // Mobile Viewport
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3344/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  console.log('Taking Mobile Hero Screenshot...');
  await page.screenshot({ path: 'variant1_mobile_hero.png' });

  await browser.close();
  server.close();
  console.log('Testing and Screenshots Complete!');
  process.exit(0);
});

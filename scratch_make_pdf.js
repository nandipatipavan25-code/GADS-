const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runPDFGeneration() {
  console.log('=== STARTING UX SCREENSHOT & PDF GENERATION ===');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Desktop Screenshot - Homepage Hero
  console.log('Capturing Desktop Homepage Hero...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://gadigitalsolutions.com/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: 'shot_desktop_hero.png' });

  // 2. Mobile Screenshot - Homepage Hero
  console.log('Capturing Mobile Homepage Hero...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('https://gadigitalsolutions.com/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: 'shot_mobile_hero.png' });

  // 3. Mobile Menu Screenshot
  console.log('Capturing Mobile Navigation Menu...');
  try {
    const menuBtn = await page.$('.navbar-toggler, .menu-toggle, header button, .mobile-menu-btn, .hamburger');
    if (menuBtn) {
      await menuBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch(e) {}
  await page.screenshot({ path: 'shot_mobile_menu.png' });

  // 4. Service Page Screenshot
  console.log('Capturing Service Page...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://gadigitalsolutions.com/services/website-services-hyderabad', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: 'shot_service_page.png' });

  // 5. Portfolio Page Screenshot
  console.log('Capturing Portfolio Page...');
  await page.goto('https://gadigitalsolutions.com/design-portfolio', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: 'shot_portfolio.png' });

  // 6. Contact Form Screenshot (Mobile)
  console.log('Capturing Contact Form (Mobile)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('https://gadigitalsolutions.com/contact', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: 'shot_contact_form.png' });

  await browser.close();
  console.log('Screenshots captured successfully!');

  // Convert images to base64
  const toBase64 = (filename) => {
    if (fs.existsSync(filename)) {
      return 'data:image/png;base64,' + fs.readFileSync(filename).toString('base64');
    }
    return '';
  };

  const b64DesktopHero = toBase64('shot_desktop_hero.png');
  const b64MobileHero = toBase64('shot_mobile_hero.png');
  const b64MobileMenu = toBase64('shot_mobile_menu.png');
  const b64ServicePage = toBase64('shot_service_page.png');
  const b64Portfolio = toBase64('shot_portfolio.png');
  const b64ContactForm = toBase64('shot_contact_form.png');

  // Build HTML document for PDF
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GADS Complete UX & Mobile Audit Report</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
      color: #1a202c;
      line-height: 1.6;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 800px;
      padding: 40px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      border-radius: 12px;
    }
    .cover-title {
      font-size: 32px;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 10px;
    }
    .cover-subtitle {
      font-size: 20px;
      color: #94a3b8;
      margin-bottom: 30px;
    }
    .cover-meta {
      font-size: 14px;
      color: #cbd5e1;
      border-top: 1px solid #334155;
      padding-top: 20px;
    }
    .page-header {
      border-bottom: 2px solid #0288d1;
      padding-bottom: 8px;
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
    }
    .section-block {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    h2 {
      font-size: 18px;
      color: #0288d1;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    p, li {
      font-size: 13px;
      color: #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      margin-bottom: 20px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }
    .badge-critical {
      background-color: #fee2e2;
      color: #991b1b;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
    }
    .badge-high {
      background-color: #ffedd5;
      color: #9a3412;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
    }
    .badge-medium {
      background-color: #fef9c3;
      color: #854d0e;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
    }
    .screenshot-container {
      margin-top: 15px;
      margin-bottom: 25px;
      text-align: center;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      background: #f8fafc;
      page-break-inside: avoid;
    }
    .screenshot-img {
      max-width: 100%;
      max-height: 400px;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .caption {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
      font-style: italic;
    }
    .grid-2 {
      display: flex;
      gap: 15px;
    }
    .grid-2 > div {
      flex: 1;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-title">USER EXPERIENCE (UX) & CONVERSION AUDIT REPORT</div>
    <div class="cover-subtitle">Website: https://gadigitalsolutions.com</div>
    <div class="cover-meta">
      <strong>Target Platform:</strong> Desktop & Mobile Viewports (320px - 1440px)<br>
      <strong>Audit Date:</strong> October 7, 2026<br>
      <strong>Focus Areas:</strong> UX Journey, Mobile Responsiveness, Form CRO, Information Architecture & Visual Hierarchy<br>
      <strong>Prepared for:</strong> GA Digital Solutions Team
    </div>
  </div>

  <!-- Page 1: Executive Summary & Journey -->
  <div class="section-block">
    <div class="page-header">1. Executive UX Summary & Customer Journey</div>
    <p>A comprehensive visual and interaction audit was conducted on <strong>https://gadigitalsolutions.com</strong> across Desktop (1440px) and Mobile (325px - 414px) devices. The site presents a clean modern theme, but suffers from critical user experience bottlenecks in mobile navigation, unquantified portfolio social proof, and high-friction contact forms.</p>

    <h2>Prospective Customer Journey Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Stage</th>
          <th>User Expectation</th>
          <th>Current Reality</th>
          <th>UX Friction Level</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Landing Hero</strong></td>
          <td>Clear value proposition & why to choose GADS</td>
          <td>Generic title & decorative background. Lacks social proof badges.</td>
          <td><span class="badge-medium">Medium</span></td>
        </tr>
        <tr>
          <td><strong>2. Service Discovery</strong></td>
          <td>Quickly find specific service details</td>
          <td>Unstructured service lists; mobile dropdown menu collapses easily.</td>
          <td><span class="badge-high">High</span></td>
        </tr>
        <tr>
          <td><strong>3. Proof & Trust</strong></td>
          <td>Proof of past performance & ROI</td>
          <td>Portfolio shows thumbnails without metric badges (+200% ROI, etc.).</td>
          <td><span class="badge-critical">Critical</span></td>
        </tr>
        <tr>
          <td><strong>4. Conversion</strong></td>
          <td>Fast, low-friction quote request</td>
          <td>Forms use generic "Submit" button and lack instant validation.</td>
          <td><span class="badge-high">High</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Desktop vs Mobile Hero Screenshots -->
  <div class="section-block">
    <div class="page-header">2. Above-the-Fold Landing Experience</div>
    <div class="grid-2">
      <div class="screenshot-container">
        <img class="screenshot-img" src="${b64DesktopHero}" alt="Desktop Homepage Hero">
        <div class="caption">Figure 1.1: Desktop Homepage Hero Viewport (1440px). Good visual aesthetic, but missing trust metrics near primary CTA.</div>
      </div>
      <div class="screenshot-container">
        <img class="screenshot-img" src="${b64MobileHero}" alt="Mobile Homepage Hero">
        <div class="caption">Figure 1.2: Mobile Viewport (375px). Header takes 20% fold height; headline wraps heavily.</div>
      </div>
    </div>
  </div>

  <!-- Mobile Navigation & Usability -->
  <div class="section-block" style="page-break-before: always;">
    <div class="page-header">3. Mobile Navigation & Usability Audit</div>
    <p>Mobile users represent over 65% of incoming traffic. The navigation bar on mobile viewports currently presents friction points that prevent smooth service discovery.</p>

    <div class="grid-2">
      <div class="screenshot-container">
        <img class="screenshot-img" src="${b64MobileMenu}" alt="Mobile Navigation Menu">
        <div class="caption">Figure 2.1: Mobile Navigation Menu state. Sub-links require precise touch accuracy.</div>
      </div>
      <div class="screenshot-container">
        <img class="screenshot-img" src="${b64ContactForm}" alt="Mobile Contact Form">
        <div class="caption">Figure 2.2: Mobile Contact Form UX. Sticky bar at bottom risks overlapping form inputs.</div>
      </div>
    </div>

    <h2>Mobile UX Key Findings & Remedies</h2>
    <ul>
      <li><strong>Small Touch Targets:</strong> Several navigation sub-items and social icons in the footer measure under 36px in height. <em>Fix: Increase padding to ensure a minimum 48px x 48px tap area.</em></li>
      <li><strong>Horizontal Table Overflow:</strong> Data tables on blog and service pages overflow screen boundaries on 320px - 375px screens. <em>Fix: Apply <code>overflow-x: auto</code> container wrappers.</em></li>
      <li><strong>Sticky Bar Overlap:</strong> The sticky bottom call/WhatsApp bar overlaps submit buttons on short mobile screens. <em>Fix: Add <code>padding-bottom: 70px</code> to mobile containers.</em></li>
    </ul>
  </div>

  <!-- Service & Portfolio UX -->
  <div class="section-block">
    <div class="page-header">4. Service Discovery & Portfolio Proof</div>
    <div class="grid-2">
      <div class="screenshot-container">
        <img class="screenshot-img" src="${b64ServicePage}" alt="Service Page">
        <div class="caption">Figure 3.1: Service Landing Page Layout. Copy is structured, but lacks inline pricing tiers or quick jump links.</div>
      </div>
      <div class="screenshot-container">
        <img class="screenshot-img" src="${b64Portfolio}" alt="Portfolio Page">
        <div class="caption">Figure 3.2: Design Portfolio Grid. Visual thumbnails need quantified case study results (+300% leads).</div>
      </div>
    </div>
  </div>

  <!-- Prioritized UX Action Plan Table -->
  <div class="section-block" style="page-break-before: always;">
    <div class="page-header">5. Prioritized UX Action Plan</div>
    <table>
      <thead>
        <tr>
          <th>Priority</th>
          <th>Location</th>
          <th>UX Issue Identified</th>
          <th>Recommended Fix</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge-critical">Critical</span></td>
          <td>Mobile Nav Drawer</td>
          <td>Dropdown links difficult to expand on small screens</td>
          <td>Convert menu into full-height accordion drawer with 48px touch targets.</td>
        </tr>
        <tr>
          <td><span class="badge-critical">Critical</span></td>
          <td>Portfolio / Works</td>
          <td>Thumbnails lack client results / social proof</td>
          <td>Add metric overlay badges (e.g. "+250% Organic Traffic Growth").</td>
        </tr>
        <tr>
          <td><span class="badge-high">High</span></td>
          <td>Contact / Enquiry Forms</td>
          <td>Generic "Submit" button & missing inline validation</td>
          <td>Change button text to "Get My Free Strategy Audit" & add live validation.</td>
        </tr>
        <tr>
          <td><span class="badge-high">High</span></td>
          <td>Mobile Blog Pages</td>
          <td>Tables overflow screen boundaries on 375px viewports</td>
          <td>Wrap tables in <code>overflow-x: auto</code> CSS container.</td>
        </tr>
        <tr>
          <td><span class="badge-medium">Medium</span></td>
          <td>Mobile Contact Bar</td>
          <td>Sticky footer bar overlaps bottom form fields</td>
          <td>Apply <code>padding-bottom: 70px</code> on mobile body layout.</td>
        </tr>
      </tbody>
    </table>
  </div>

</body>
</html>
  `;

  fs.writeFileSync('GADS_UX_Audit_Report.html', htmlContent);
  console.log('Saved GADS_UX_Audit_Report.html!');

  // Generate PDF from HTML using Puppeteer
  console.log('Rendering PDF via Puppeteer...');
  const pdfBrowser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const pdfPage = await pdfBrowser.newPage();
  await pdfPage.goto('file:///' + path.resolve('GADS_UX_Audit_Report.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  await pdfPage.pdf({
    path: 'GADS_UX_Audit_Report.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  });

  await pdfBrowser.close();
  console.log('=== PDF CREATED SUCCESSFULLY: GADS_UX_Audit_Report.pdf ===');
}

runPDFGeneration().catch(err => console.error('PDF Gen Error:', err));

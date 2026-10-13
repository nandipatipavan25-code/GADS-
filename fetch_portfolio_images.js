const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }
};

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        return downloadImage(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

https.get('https://gadigitalsolutions.com/portfolio', options, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', async () => {
    console.log('Status Code:', res.statusCode, 'HTML length:', html.length);
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    const urls = [];
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      const fullUrl = new URL(src, 'https://gadigitalsolutions.com/portfolio').href;
      urls.push(fullUrl);
    }
    console.log('Found Image URLs:', urls);
  });
}).on('error', err => console.error(err));

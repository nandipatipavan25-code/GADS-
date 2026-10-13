const fs = require('fs');
const html = fs.readFileSync('current_homepage.html', 'utf8');

const sIdx = html.indexOf('Brand Identities');
if (sIdx !== -1) {
  console.log(html.slice(sIdx - 100, sIdx + 4000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 2000));
}

const fs = require('fs');
const html = fs.readFileSync('current_homepage.html', 'utf-8');

console.log('--- ALL IMAGES ---');
const imgRegex = /<img\s+[^>]*src=["']([^"']*)["'][^>]*>/gi;
let m;
const imgs = [];
while ((m = imgRegex.exec(html)) !== null) {
  imgs.push(m[1]);
}
console.log(imgs);

console.log('--- ALL PHONE NUMBERS, EMAILS, ADDRESSES ---');
console.log(html.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/g));
console.log(html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g));

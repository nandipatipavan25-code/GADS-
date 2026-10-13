const fs = require('fs');
const html = fs.readFileSync('current_homepage.html', 'utf8');

// Find testimonials text
const testIdx = html.indexOf('TESTIMONIALS');
if (testIdx !== -1) {
  console.log('--- TESTIMONIALS CONTENT ---');
  console.log(html.slice(testIdx, testIdx + 3000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1500));
}

// Find projects/portfolio content
console.log('\n--- PORTFOLIO / WORKS LINKS ---');
const links = html.match(/href=["'][^"']*(?:work|portfolio|website|client)[^"']*["']/gi) || [];
console.log([...new Set(links)]);

// Find images
const imgs = html.match(/src=["'][^"']+\.(?:png|jpg|jpeg|svg|webp|gif)["']/gi) || [];
console.log('\n--- SAMPLE IMAGES (count: ' + imgs.length + ') ---');
console.log([...new Set(imgs)].slice(0, 30));

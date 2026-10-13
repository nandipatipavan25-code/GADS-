const fs = require('fs');
const html = fs.readFileSync('current_homepage.html', 'utf8');

const testIdx = html.indexOf('testimonial-slider-container');
if (testIdx !== -1) {
  console.log(html.slice(testIdx, testIdx + 3000));
}

const fs = require('fs');
const html = fs.readFileSync('current_homepage.html', 'utf8');

const terms = [
  'Healthcare',
  'E-commerce',
  'Real Estate',
  'Education',
  'Website Services',
  'Application Development',
  'Content Marketing',
  'Performance Marketing',
  'Lead Management Services',
  'Reseller Services',
  'Collaboration Services',
  'About Us'
];

terms.forEach(term => {
  const idx = html.indexOf(term);
  if (idx !== -1) {
    console.log(`\n=== FOUND: ${term} ===`);
    console.log(html.slice(idx, idx + 400).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  }
});

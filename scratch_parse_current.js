const fs = require('fs');

const html = fs.readFileSync('current_homepage.html', 'utf-8');

// Simple regex parser
function extractTags(tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  let match;
  const results = [];
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) results.push(text);
  }
  return results;
}

console.log('=== H1 ===\n', extractTags('h1'));
console.log('=== H2 ===\n', extractTags('h2'));
console.log('=== H3 ===\n', extractTags('h3'));
console.log('=== H4 ===\n', extractTags('h4'));

// Extract paragraphs
const paragraphs = extractTags('p');
console.log('\n=== PARAGRAPHS COUNT ===', paragraphs.length);
console.log('Sample paragraphs:\n', paragraphs.slice(0, 15).join('\n---\n'));

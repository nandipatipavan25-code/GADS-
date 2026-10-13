const fs = require('fs');
const html = fs.readFileSync('current_homepage.html', 'utf-8');

// Find all text blocks and structure
const stripped = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                     .replace(/<!--[\s\S]*?-->/g, '');

// Let's dump all anchor tags with their text
const links = [];
const aRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
let m;
while ((m = aRegex.exec(stripped)) !== null) {
  const href = m[1];
  const txt = m[2].replace(/<[^>]+>/g, '').trim();
  if (txt && !href.startsWith('#') && !href.startsWith('javascript')) {
    links.push({ txt, href });
  }
}

console.log('=== LINKS FOUND ===');
console.log(JSON.stringify(links, null, 2));

// Let's dump the entire text grouped by containers
const blocks = stripped.split(/<\/(?:div|section|article|p|li|h1|h2|h3|h4|h5|h6)>/i)
  .map(b => b.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
  .filter(b => b.length > 20);

// deduplicate consecutive or identical blocks
const uniqueBlocks = [...new Set(blocks)];
console.log('\n=== UNIQUE TEXT BLOCKS (' + uniqueBlocks.length + ') ===');
uniqueBlocks.forEach((b, idx) => {
  console.log(`[${idx}] ${b}`);
});

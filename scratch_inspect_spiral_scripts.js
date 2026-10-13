const fs = require('fs');
const html = fs.readFileSync('spiral_framer.html', 'utf8');

const scriptMatches = html.match(/src=["']([^"']+)["']/g) || [];
console.log('Script sources:');
scriptMatches.forEach(s => console.log(s));

// Look for chunk urls
const chunkMatches = html.match(/https:\/\/framerusercontent\.com\/modules\/[^"']+/g) || [];
console.log('Chunk matches:', [...new Set(chunkMatches)]);

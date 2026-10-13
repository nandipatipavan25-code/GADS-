const fs = require('fs');
const html = fs.readFileSync('spiral_framer.html', 'utf8');

const matches = html.match(/https:\/\/[^"'\s>]+\.mjs/g) || [];
console.log('MJS URLs in HTML:', [...new Set(matches)]);

const relativeMatches = html.match(/["'](\/[^"']+\.mjs)["']/g) || [];
console.log('Relative MJS URLs in HTML:', [...new Set(relativeMatches)]);

const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

const startIdx = code.indexOf('document.createElement(`canvas`)');
console.log('Canvas creation at index:', startIdx);
console.log('\n--- CODE DUMP (Next 4000 chars) ---');
console.log(code.slice(startIdx - 100, startIdx + 4000));

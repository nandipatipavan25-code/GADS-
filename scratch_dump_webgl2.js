const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

const startIdx = 1641 + 4000;
console.log('--- CODE DUMP (Next 4000 chars) ---');
console.log(code.slice(startIdx, startIdx + 4000));

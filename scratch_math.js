const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

const startIdx = 0;
console.log('--- FIRST 2000 CHARS OF mod1.mjs ---');
console.log(code.slice(0, 2000));

const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

console.log(code.slice(9000, 14000));

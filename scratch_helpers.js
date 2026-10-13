const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

const helpers = ['re =', 'ie =', 'function H', 'function te', 'function z', 'function B', 'function R', 'let L =', 'const L ='];
helpers.forEach(h => {
  const idx = code.indexOf(h);
  console.log(`Helper ${h}: index ${idx}`);
  if (idx !== -1) {
    console.log(code.slice(idx, idx + 400));
  }
});

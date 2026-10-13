const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

// Find all var/let/const/function declarations at the end or around the component
const idx = code.lastIndexOf('function');
console.log('Last function index:', idx);

// Search for shaders re and ie
const reIdx = code.indexOf('re=`');
console.log('re=` index:', reIdx);
if (reIdx !== -1) console.log(code.slice(reIdx - 50, reIdx + 200));

const ieIdx = code.indexOf('ie=`');
console.log('ie=` index:', ieIdx);
if (ieIdx !== -1) console.log(code.slice(ieIdx - 50, ieIdx + 200));

const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

console.log('Length:', code.length);
console.log('First 500 chars:', code.slice(0, 500));
console.log('Last 500 chars:', code.slice(-500));

// Find vertex and fragment shaders
const shaderMatches = code.match(/[`"][^`"]*(?:void main|gl_Position|gl_FragColor)[^`"]*[`"]/g) || [];
console.log('Shaders found:', shaderMatches.length);
shaderMatches.forEach((s, i) => {
  console.log(`\nShader ${i+1}:`);
  console.log(s.slice(0, 300));
});

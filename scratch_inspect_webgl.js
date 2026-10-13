const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

// Find gl initialization and rendering
const canvasIdx = code.indexOf('.getContext("webgl")') !== -1 ? code.indexOf('.getContext("webgl")') : code.indexOf("getContext('webgl')");
console.log('getContext webgl index:', canvasIdx);
if (canvasIdx !== -1) {
  console.log(code.slice(canvasIdx - 200, canvasIdx + 800));
}

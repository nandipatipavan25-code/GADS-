const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

const matches = code.match(/getContext\([^)]+\)/g) || [];
console.log('getContext matches:', matches);

const canvasOccurrences = [];
let pos = 0;
while ((pos = code.indexOf('canvas', pos)) !== -1) {
  canvasOccurrences.push(pos);
  pos += 6;
}
console.log('canvas occurrences:', canvasOccurrences.length);
canvasOccurrences.slice(0, 5).forEach(p => {
  console.log(code.slice(p - 50, p + 150));
});

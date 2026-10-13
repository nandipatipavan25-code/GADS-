const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

console.log('--- EXPORTS in mod1.mjs ---');
const exportsMatch = code.match(/export\s*\{[^}]+\}/g) || [];
exportsMatch.forEach(e => console.log(e));

// Find component name or keywords
const keywords = ['SpatialGallery', 'tunnel', 'Three', 'gl', 'canvas', 'vertex', 'fragment', 'shader'];
keywords.forEach(k => {
  const count = (code.match(new RegExp(k, 'gi')) || []).length;
  console.log(`${k}: ${count}`);
});

// Look for property controls or settings
const propControls = code.match(/addPropertyControls\s*\([^,]+,\s*\{[\s\S]*?\}\s*\)/g);
if (propControls) {
  console.log('\n--- PROPERTY CONTROLS FOUND ---');
  console.log(propControls[0].slice(0, 1000));
} else {
  console.log('No addPropertyControls match with simple regex, searching...');
  const idx = code.indexOf('addPropertyControls');
  if (idx !== -1) {
    console.log(code.slice(idx, idx + 1000));
  }
}

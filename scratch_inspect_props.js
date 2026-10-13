const fs = require('fs');
const code = fs.readFileSync('mod1.mjs', 'utf8');

// Search for the component function definition
const compFunc = code.match(/function\s+I\s*\(\{([^}]+)\}/);
if (compFunc) {
  console.log('Component props signature:');
  console.log(compFunc[1]);
}

// Find defaults or settings
const defaults = code.match(/\{items:e=\[\][^;]+/);
if (defaults) {
  console.log('Defaults:\n', defaults[0]);
}

const fs = require('fs');
const code = fs.readFileSync('spiral_main.mjs', 'utf8');

const importRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
let m;
while ((m = importRegex.exec(code)) !== null) {
  console.log('Dynamic import:', m[1]);
}

const staticImportRegex = /import\s+[^;]+from\s*['"]([^'"]+)['"]/g;
while ((m = staticImportRegex.exec(code)) !== null) {
  console.log('Static import:', m[1]);
}

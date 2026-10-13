const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const entries = fs.readdirSync(srcDir, { withFileTypes: true });

for (const entry of entries) {
  if (['node_modules', '.git', 'dist', '.gitignore'].includes(entry.name)) {
    continue;
  }
  const srcPath = path.join(srcDir, entry.name);
  const destPath = path.join(distDir, entry.name);

  fs.cpSync(srcPath, destPath, { recursive: true });
}

// Ensure default index.html is copied
console.log('Build completed successfully: dist folder prepared for static publishing.');

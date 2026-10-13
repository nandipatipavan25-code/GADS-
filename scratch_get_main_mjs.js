const https = require('https');
const fs = require('fs');

https.get('https://framerusercontent.com/sites/zdAD4yb1Uc5aRb6eW1xJN/script_main.Cm0M7RHD.mjs', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('spiral_main.mjs', data);
    console.log('Saved spiral_main.mjs, length:', data.length);
    const imports = data.match(/https:\/\/[^"']+/g) || [];
    console.log('Imports/URLs in main:', [...new Set(imports)]);
  });
});

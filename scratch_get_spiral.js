const https = require('https');
const fs = require('fs');

https.get('https://beforeafter.framer.website/spiral', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('spiral_framer.html', data);
    console.log('Saved spiral_framer.html, length:', data.length);
    const scripts = data.match(/https:\/\/[^"']+\.js/g) || [];
    console.log('Scripts found:', scripts);
  });
});

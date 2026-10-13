const https = require('https');
const fs = require('fs');

async function checkUrl(url, name) {
  return new Promise(resolve => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        fs.writeFileSync(name, data);
        console.log(`Saved ${name}, size: ${data.length}`);
        if (data.includes('Spatial') || data.includes('tunnel') || data.includes('webgl') || data.includes('three')) {
          console.log(`>>> ${name} CONTAINS SPATIAL/WEBGL/THREE!`);
        }
        resolve();
      });
    });
  });
}

(async () => {
  await checkUrl('https://framerusercontent.com/sites/zdAD4yb1Uc5aRb6eW1xJN/cUTUEaBRG1aGrjtqXOtJKoRhOPWRRoN1xRGjnrjDvnY.3--6JBT_.mjs', 'mod1.mjs');
  await checkUrl('https://framerusercontent.com/sites/zdAD4yb1Uc5aRb6eW1xJN/dE9n4jjzsyocd_APiYI6hQtUkuUyC3E_rmQkKVpNPwE.CLNeuqxG.mjs', 'mod2.mjs');
})();

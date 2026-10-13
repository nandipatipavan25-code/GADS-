const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  }
};

const portfolioProjects = [
  { file: 'port_padmaja.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Padmaja.jpg', title: 'Padmaja Foods', link: 'https://padmajafoods.com/' },
  { file: 'port_susadhyaa.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Susadhyaa.jpg', title: 'Susaadhya Greens', link: 'https://susaadhyagreens.com/' },
  { file: 'port_delicious.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Delicious.jpg', title: 'Delicious Foods', link: '#projects' },
  { file: 'port_kigo_dental.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Kigo-dental.jpg', title: 'Kigo Dental', link: 'https://kigodental.com/' },
  { file: 'port_baking_studio.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Banking-Studio.jpg', title: 'Baking Studio', link: 'https://bakingstudios.com/' },
  { file: 'port_amazon_vanlines.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Amazon%20Van%20Lines.jpg', title: 'Amazon Van Lines', link: 'https://amazonvanlines.com/' },
  { file: 'port_bohemian_soul.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Bohemian%20Soul.jpg', title: 'Bohemian Soul', link: 'https://bohemiansoul.in/' },
  { file: 'port_gsm.webp', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/gsm.webp', title: 'GSM Global', link: 'https://gsmglobal.co.in/' },
  { file: 'port_palod_loya.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Palod%20&%20Loya.jpg', title: 'Palod & Loya', link: 'https://palodandloya.com/' },
  { file: 'port_cpvia.webp', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/CPVIA.webp', title: 'CPVIA', link: '#projects' },
  { file: 'port_aoda.webp', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Aoda.webp', title: 'Aoda', link: '#projects' },
  { file: 'port_sci_hex.webp', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Sci%20Hex.webp', title: 'Sci Hex', link: '#projects' },
  { file: 'port_zip_pouch.webp', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Zip%20pouch.webp', title: 'Zip Pouch', link: '#projects' },
  { file: 'port_panjwani_foods.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Panjwani-foods.jpg', title: 'Panjwani Foods', link: '#projects' },
  { file: 'port_surakshaa_infra.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Surakshaa-infra.jpg', title: 'Surakshaa Infra', link: '#projects' },
  { file: 'port_clear_skin_clinic.jpg', url: 'https://gadigitalsolutions.com/images/portfolio/our-work-Images/Clear%20Skin%20Clinic.jpg', title: 'Clear Skin Clinic', link: '#projects' }
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        return downloadImage(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
  for (const item of portfolioProjects) {
    const dest = path.join(__dirname, item.file);
    try {
      await downloadImage(item.url, dest);
      const stats = fs.statSync(dest);
      console.log(`Downloaded ${item.file} (${stats.size} bytes)`);
    } catch (err) {
      console.error(`Failed ${item.file}:`, err.message);
    }
  }
  console.log('ALL 16 PORTFOLIO IMAGES DOWNLOADED SUCCESSFULLY!');
})();

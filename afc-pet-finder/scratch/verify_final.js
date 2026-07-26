const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let len = res.headers['content-length'] || 0;
      let type = res.headers['content-type'] || '';
      resolve({ url, status: res.statusCode, type, len });
    }).on('error', (e) => resolve({ url, status: 'ERROR', error: e.message }));
  });
}

async function verifyFinal() {
  console.log('=== Final Verification on afc-pet-finder.vercel.app ===');
  const urls = [
    'https://afc-pet-finder.vercel.app/manifest.json',
    'https://afc-pet-finder.vercel.app/icons/icon-maskable-512.png',
    'https://afc-pet-finder.vercel.app/icons/icon-512.png',
    'https://afc-pet-finder.vercel.app/icons/icon-192.png'
  ];

  for (const u of urls) {
    const res = await check(u + '?t=' + Date.now());
    console.log(`URL: ${res.url}`);
    console.log(` -> Status: ${res.status} | Type: ${res.type} | Length: ${res.len}`);
  }
}

verifyFinal();

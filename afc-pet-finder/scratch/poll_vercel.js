const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    }).on('error', () => resolve({ statusCode: 500 }));
  });
}

async function poll() {
  console.log('--- Polling Vercel Production Deployment ---');
  for (let i = 1; i <= 6; i++) {
    console.log(`[Attempt ${i}] Checking manifest.json & icon-maskable-512.png...`);
    const manifest = await fetchUrl('https://afc-pet-finder.vercel.app/manifest.json?t=' + Date.now());
    const icon = await fetchUrl('https://afc-pet-finder.vercel.app/icons/icon-maskable-512.png?t=' + Date.now());

    console.log(` -> manifest status: ${manifest.statusCode}`);
    console.log(` -> icon-maskable-512.png status: ${icon.statusCode} (length: ${icon.headers ? icon.headers['content-length'] : 0})`);

    if (manifest.data && manifest.data.includes('v6')) {
      console.log('🎉🎉🎉 SUCCESS! Manifest v6 is LIVE on Vercel!');
      break;
    }

    await new Promise(r => setTimeout(r, 5000));
  }
}

poll();

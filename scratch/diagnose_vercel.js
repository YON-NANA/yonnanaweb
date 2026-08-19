const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function checkSite() {
  console.log('--- Checking Vercel Site ---');
  const manifest = await fetchUrl('https://afc-pet-finder.vercel.app/manifest.json');
  console.log('manifest.json HTTP Status:', manifest.statusCode);
  console.log('manifest.json content:\n', manifest.data);

  const icon1 = await fetchUrl('https://afc-pet-finder.vercel.app/icons/icon-maskable-512.png');
  console.log('icon-maskable-512.png HTTP Status:', icon1.statusCode, 'Content-Length:', icon1.headers['content-length']);

  const icon2 = await fetchUrl('https://afc-pet-finder.vercel.app/icons/icon-512.png');
  console.log('icon-512.png HTTP Status:', icon2.statusCode, 'Content-Length:', icon2.headers['content-length']);

  const html = await fetchUrl('https://afc-pet-finder.vercel.app/index.html');
  console.log('index.html HTTP Status:', html.statusCode);
}

checkSite();

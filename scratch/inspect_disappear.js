const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, status: res.statusCode, headers: res.headers, body: data.substring(0, 500) }));
    }).on('error', (e) => resolve({ url, status: 'ERROR', error: e.message }));
  });
}

async function run() {
  console.log('=== Inspecting Site Status ===');
  const res1 = await check('https://afc-pet-finder.vercel.app/?t=' + Date.now());
  console.log('GET / -> Status:', res1.status);
  console.log('Headers:', res1.headers);
  console.log('Body:', res1.body);

  const res2 = await check('https://afc-pet-finder.vercel.app/index.html?t=' + Date.now());
  console.log('GET /index.html -> Status:', res2.status);
  console.log('Headers:', res2.headers);
  console.log('Body:', res2.body);
}

run();

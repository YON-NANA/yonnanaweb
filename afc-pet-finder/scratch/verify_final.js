const http = require('http');

const urls = [
  'http://localhost:8080/index.html',
  'http://localhost:8080/manifest.json',
  'http://localhost:8080/sw.js',
  'http://localhost:8080/css/style.css',
  'http://localhost:8080/icons/icon-192.png',
  'http://localhost:8080/icons/icon-512.png',
  'http://localhost:8080/icons/icon-maskable-192.png',
  'http://localhost:8080/favicon.ico'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${url} (${size} bytes)`);
        resolve(res.statusCode === 200);
      });
    }).on('error', (err) => {
      console.error(`[FAIL] ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log('--- Verifying Server & PWA Assets ---');
  let allOk = true;
  for (const u of urls) {
    const ok = await checkUrl(u);
    if (!ok) allOk = false;
  }
  if (allOk) {
    console.log('\n🎉 ALL PWA ASSETS VERIFIED SUCCESSFULLY!');
  } else {
    console.log('\n❌ SOME ASSETS FAILED TO LOAD');
  }
  process.exit(0);
}

run();

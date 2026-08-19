const https = require('https');

function get(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ url, status: res.statusCode, body }));
    }).on('error', (e) => resolve({ url, status: 'ERROR', error: e.message }));
  });
}

async function run() {
  console.log('=== Inspecting Remote Details ===');
  const resHtml = await get('https://afc-pet-finder.vercel.app/?t=' + Date.now());
  console.log('HTML Status:', resHtml.status);
  console.log('Includes early beforeinstallprompt listener?:', resHtml.body.includes('Early beforeinstallprompt captured'));
  console.log('Includes green/red/blue logo in header?:', resHtml.body.includes('assets/afc-logo-full.png'));

  const resManifest = await get('https://afc-pet-finder.vercel.app/manifest.json?t=' + Date.now());
  console.log('Manifest Status:', resManifest.status);
  console.log('Manifest snippet:', resManifest.body.substring(0, 300));
}

run();

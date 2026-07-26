const https = require('https');

https.get('https://afc-pet-finder.vercel.app/manifest.json?t=' + Date.now(), (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('=== Remote manifest.json ===');
    console.log(body);
  });
});

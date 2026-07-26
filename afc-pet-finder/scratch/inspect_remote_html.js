const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function inspect() {
  const html = await fetchUrl('https://afc-pet-finder.vercel.app/index.html');
  console.log('--- Remote index.html Head Snippet ---');
  const headMatch = html.match(/<head>[\s\S]*?<\/head>/i);
  if (headMatch) {
    console.log(headMatch[0]);
  } else {
    console.log(html.substring(0, 1000));
  }
}

inspect();

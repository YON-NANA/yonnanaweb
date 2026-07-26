const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      if (childItemName === 'node_modules' || childItemName === '.git' || childItemName === 'scratch') return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('--- Copying afc-pet-finder content to ROOT directory ---');

// Copy HTML files, css, js, icons, assets, img, manifest.json, sw.js to root
const itemsToSync = [
  'index.html', 'map.html', 'match.html', 'admin-data.html', 'chat.html',
  'lost-register.html', 'found-register.html', 'poster.html', 'guide.html',
  'privacy.html', 'terms.html', 'manifest.json', 'sw.js', 'favicon.ico',
  'css', 'js', 'icons', 'assets', 'img'
];

itemsToSync.forEach(item => {
  const src = path.join(SUB, item);
  const dest = path.join(ROOT, item);
  if (fs.existsSync(src)) {
    copyRecursiveSync(src, dest);
    console.log(`Synced: ${item} -> ROOT`);
  }
});

console.log('🎉 Successfully made ROOT directory identical to afc-pet-finder!');

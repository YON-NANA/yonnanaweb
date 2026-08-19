const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const subDir = __dirname;

console.log('Root:', rootDir);
console.log('Sub:', subDir);

// バージョン番号を一括で v28 に更新
const htmlFiles = [
  'index.html', 'map.html', 'poster.html', 'lost-register.html', 
  'found-register.html', 'match.html', 'chat.html', 'admin-data.html', 
  'guide.html', 'privacy.html', 'terms.html'
];

htmlFiles.forEach(file => {
  const subFilePath = path.join(subDir, file);
  if (fs.existsSync(subFilePath)) {
    let content = fs.readFileSync(subFilePath, 'utf-8');
    // api.js にバージョンクエリを付与
    content = content.replace(/src=["']js\/api\.js(\?v=\d+)?["']/g, 'src="js/api.js?v=28"');
    content = content.replace(/href=["']css\/style\.css(\?v=\d+)?["']/g, 'href="css/style.css?v=28"');
    content = content.replace(/manifest\.json(\?v=\d+)?/g, 'manifest.json?v=28');
    fs.writeFileSync(subFilePath, content, 'utf-8');
  }
});

// sw.js のバージョンを v28 に更新
const swPath = path.join(subDir, 'sw.js');
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf-8');
  sw = sw.replace(/afc-pet-finder-v\d+/g, 'afc-pet-finder-v28');
  sw = sw.replace(/Service Worker v\d+/g, 'Service Worker v28');
  fs.writeFileSync(swPath, sw, 'utf-8');
}

console.log('Updated cache busters in subDir.');

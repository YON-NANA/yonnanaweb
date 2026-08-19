const fs = require('fs');
const path = require('path');

const afcDir = path.resolve(__dirname, '..'); // c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder
const rootDir = path.resolve(afcDir, '..');  // c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ

console.log('afcDir:', afcDir);
console.log('rootDir:', rootDir);

const filesToSync = [
  'admin-data.html',
  'chat.html',
  'found-register.html',
  'guide.html',
  'index.html',
  'index_test.html',
  'lost-register.html',
  'map.html',
  'match.html',
  'poster.html',
  'privacy.html',
  'terms.html',
  'sw.js',
  'manifest.json',
  'favicon.ico',
  'afc-logo.png'
];

// afcDir 内の HTML キャッシュバスター更新
filesToSync.filter(f => f.endsWith('.html')).forEach(file => {
  const filePath = path.join(afcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/src=["']js\/api\.js(\?v=\d+)?["']/g, 'src="js/api.js?v=28"');
    content = content.replace(/href=["']css\/style\.css(\?v=\d+)?["']/g, 'href="css/style.css?v=28"');
    content = content.replace(/manifest\.json(\?v=\d+)?/g, 'manifest.json?v=28');
    fs.writeFileSync(filePath, content, 'utf-8');
  }
});

// sw.js 更新
const swPath = path.join(afcDir, 'sw.js');
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf-8');
  sw = sw.replace(/afc-pet-finder-v\d+/g, 'afc-pet-finder-v28');
  sw = sw.replace(/Service Worker v\d+/g, 'Service Worker v28');
  fs.writeFileSync(swPath, sw, 'utf-8');
}

// フォルダ（js, css, assets, img, icons）とファイルを rootDir へ同期コピー
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// ファイルコピー
filesToSync.forEach(file => {
  const src = path.join(afcDir, file);
  const dest = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Synced: ${file} -> root`);
  }
});

// ディレクトリコピー
['js', 'css', 'assets', 'img', 'icons'].forEach(dir => {
  const src = path.join(afcDir, dir);
  const dest = path.join(rootDir, dir);
  copyRecursive(src, dest);
  console.log(`Synced dir: ${dir} -> root`);
});

console.log('All files successfully synced to repository root!');

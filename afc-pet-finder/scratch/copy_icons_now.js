const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.readdirSync(srcDir).forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file} -> ${destDir}`);
    }
  });
}

// 1. Copy SUB/icons to ROOT/icons
copyDir(path.join(SUB, 'icons'), path.join(ROOT, 'icons'));

// 2. Copy SUB/assets to ROOT/assets
if (fs.existsSync(path.join(SUB, 'assets'))) {
  copyDir(path.join(SUB, 'assets'), path.join(ROOT, 'assets'));
}

// 3. Copy SUB/img to ROOT/img
if (fs.existsSync(path.join(SUB, 'img'))) {
  copyDir(path.join(SUB, 'img'), path.join(ROOT, 'img'));
}

// 4. Copy favicon.ico, manifest.json, sw.js
fs.copyFileSync(path.join(SUB, 'favicon.ico'), path.join(ROOT, 'favicon.ico'));
fs.copyFileSync(path.join(SUB, 'manifest.json'), path.join(ROOT, 'manifest.json'));
fs.copyFileSync(path.join(SUB, 'sw.js'), path.join(ROOT, 'sw.js'));

console.log('🎉 PERFECT! All icons, manifest, sw synced to ROOT!');

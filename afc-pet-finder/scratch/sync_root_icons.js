const fs = require('fs');
const path = require('path');

const BASE = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const subDir = path.join(BASE, 'afc-pet-finder');

// 1. Copy icons directory files from afc-pet-finder/icons to root /icons
const rootIcons = path.join(BASE, 'icons');
const subIcons  = path.join(subDir, 'icons');

if (!fs.existsSync(rootIcons)) fs.mkdirSync(rootIcons, { recursive: true });

fs.readdirSync(subIcons).forEach(file => {
  fs.copyFileSync(path.join(subIcons, file), path.join(rootIcons, file));
  console.log(`Copied icon: ${file} to root /icons/`);
});

// 2. Copy assets & img & favicon.ico
const rootAssets = path.join(BASE, 'assets');
const subAssets  = path.join(subDir, 'assets');
if (fs.existsSync(subAssets)) {
  if (!fs.existsSync(rootAssets)) fs.mkdirSync(rootAssets, { recursive: true });
  fs.readdirSync(subAssets).forEach(file => {
    fs.copyFileSync(path.join(subAssets, file), path.join(rootAssets, file));
  });
}

const rootImg = path.join(BASE, 'img');
const subImg  = path.join(subDir, 'img');
if (fs.existsSync(subImg)) {
  if (!fs.existsSync(rootImg)) fs.mkdirSync(rootImg, { recursive: true });
  fs.readdirSync(subImg).forEach(file => {
    fs.copyFileSync(path.join(subImg, file), path.join(rootImg, file));
  });
}

fs.copyFileSync(path.join(subDir, 'favicon.ico'), path.join(BASE, 'favicon.ico'));
fs.copyFileSync(path.join(subDir, 'manifest.json'), path.join(BASE, 'manifest.json'));
fs.copyFileSync(path.join(subDir, 'sw.js'), path.join(BASE, 'sw.js'));

console.log('🎉 Successfully synced all PWA icons & manifest to ROOT directory!');

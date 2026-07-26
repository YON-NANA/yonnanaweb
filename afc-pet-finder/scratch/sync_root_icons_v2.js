const fs = require('fs');
const path = require('path');

const BASE = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const subDir = path.join(BASE, 'afc-pet-finder');

const rootIcons = path.join(BASE, 'icons');
const subIcons  = path.join(subDir, 'icons');

if (!fs.existsSync(rootIcons)) fs.mkdirSync(rootIcons, { recursive: true });

const files = fs.readdirSync(subIcons);
files.forEach(file => {
  const src = path.join(subIcons, file);
  const dest = path.join(rootIcons, file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, dest);
    console.log(`Copied icon -> ${file}`);
  }
});

console.log('✅ All icon files copied to ROOT /icons/ directory');

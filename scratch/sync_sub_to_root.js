const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';
const destDir = 'C:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (childItemName === '.git' || childItemName === 'scratch' || childItemName === 'node_modules') return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(srcDir, destDir);
console.log('Successfully synced all afc-pet-finder files to repo root!');

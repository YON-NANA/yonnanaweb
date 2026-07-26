const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed directory: ${dir}`);
  }
}

removeDir(path.join(ROOT, 'public'));
removeDir(path.join(SUB, 'public'));

console.log('✅ Cleaned up public directories to restore Vercel deployment!');

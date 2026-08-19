const fs = require('fs');
const path = require('path');

const lockFile = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\.git\\index.lock';
if (fs.existsSync(lockFile)) {
  fs.unlinkSync(lockFile);
  console.log('Unlocked git index.lock!');
} else {
  console.log('No lock file found.');
}

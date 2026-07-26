const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';

const brainFiles = fs.readdirSync(brainDir);
const mediaFiles = [];

brainFiles.forEach(f => {
  const p = path.join(brainDir, f);
  if (fs.statSync(p).isFile() && f.startsWith('media__')) {
    const stat = fs.statSync(p);
    mediaFiles.push({ name: f, time: stat.mtime, size: stat.size, path: p });
  }
});

mediaFiles.sort((a, b) => b.time - a.time);

console.log('=== Recent Media Files ===');
mediaFiles.slice(0, 5).forEach(m => {
  console.log(`${m.name} - ${m.time.toISOString()} - ${m.size} bytes`);
});

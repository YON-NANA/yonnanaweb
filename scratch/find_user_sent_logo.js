const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const mediaDir = path.join(brainDir, '.tempmediaStorage');

console.log('=== Checking Temp Media Storage ===');
if (fs.existsSync(mediaDir)) {
  const files = fs.readdirSync(mediaDir);
  files.forEach(f => {
    const p = path.join(mediaDir, f);
    const stat = fs.statSync(p);
    console.log(`${f} - ${stat.mtime.toISOString()} - ${stat.size} bytes`);
  });
}

console.log('=== Checking Brain root files ===');
const brainFiles = fs.readdirSync(brainDir);
brainFiles.forEach(f => {
  const p = path.join(brainDir, f);
  if (fs.statSync(p).isFile()) {
    const stat = fs.statSync(p);
    console.log(`${f} - ${stat.mtime.toISOString()} - ${stat.size} bytes`);
  }
});

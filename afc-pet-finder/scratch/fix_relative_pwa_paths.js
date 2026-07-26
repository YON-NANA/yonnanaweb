const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let updated = content;
  updated = updated.replace(/href="\/manifest\.json"/g, 'href="manifest.json"');
  updated = updated.replace(/href="\/icons\/icon-192\.png"/g, 'href="icons/icon-192.png"');
  updated = updated.replace(/href="\/icons\/icon-512\.png"/g, 'href="icons/icon-512.png"');
  updated = updated.replace(/href="\/icons\/afc-logo\.png"/g, 'href="icons/afc-logo.png"');

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

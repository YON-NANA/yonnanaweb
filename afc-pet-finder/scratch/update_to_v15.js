const fs = require('fs');
const path = require('path');

const BASE = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

// 1. Update manifest.json
const manifestPath = path.join(BASE, 'manifest.json');
let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.id = './?v=15';
manifest.start_url = './index.html?v=15';
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Updated manifest.json to v15');

// 2. Update sw.js
const swPath = path.join(BASE, 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace(/v14/g, 'v15');
fs.writeFileSync(swPath, swContent, 'utf8');
console.log('Updated sw.js to v15');

// 3. Update all HTML files (icons, style, manifest links)
const htmlFiles = fs.readdirSync(BASE).filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
  const filePath = path.join(BASE, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/manifest\.json\?v=\d+/g, 'manifest.json?v=15');
  content = content.replace(/favicon\.ico\?v=\d+/g, 'favicon.ico?v=7');
  content = content.replace(/icons\/icon-([a-z0-9\-]+)\.png\?v=\d+/g, 'icons/icon-$1.png?v=7');
  content = content.replace(/css\/style\.css\?v=\d+/g, 'css/style.css?v=15');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

console.log('ALL FILES UPDATED TO v15!');

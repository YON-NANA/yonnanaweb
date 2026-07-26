const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

// Ensure icons, assets, and public/icons exist in both ROOT and SUB
const dirs = [
  path.join(ROOT, 'icons'),
  path.join(SUB, 'icons'),
  path.join(ROOT, 'public', 'icons'),
  path.join(SUB, 'public', 'icons')
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Copy all icon files from SUB/icons to all target dirs
const srcIcons = path.join(SUB, 'icons');
if (fs.existsSync(srcIcons)) {
  const files = fs.readdirSync(srcIcons);
  files.forEach(f => {
    dirs.forEach(d => {
      const srcFile = path.join(srcIcons, f);
      const destFile = path.join(d, f);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  });
}

// Write robust manifest.json with HTTP relative paths and clean fallback
const manifestObj = {
  "name": "AnimalFinderConnect",
  "short_name": "AFC",
  "id": "./?v=8",
  "description": "日本動物共助機構（AFC）による迷子ペット捜索プラットフォーム",
  "start_url": "./index.html?v=8",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0B5394",
  "theme_color": "#0B5394",
  "prefer_related_applications": false,
  "icons": [
    {
      "src": "icons/icon-maskable-512.png?v=8",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-maskable-192.png?v=8",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512.png?v=8",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-192.png?v=8",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/afc-logo-full.png?v=8",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
};

const manifestStr = JSON.stringify(manifestObj, null, 2);

fs.writeFileSync(path.join(ROOT, 'manifest.json'), manifestStr, 'utf8');
fs.writeFileSync(path.join(SUB, 'manifest.json'), manifestStr, 'utf8');

console.log('🎉 Public icons & Manifest v8 configured for full Android WebAPK compatibility!');

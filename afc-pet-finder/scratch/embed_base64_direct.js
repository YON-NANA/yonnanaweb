const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

const icon512Path = path.join(SUB, 'icons', 'icon-512.png');
const icon192Path = path.join(SUB, 'icons', 'icon-192.png');

const b64_512 = 'data:image/png;base64,' + fs.readFileSync(icon512Path).toString('base64');
const b64_192 = 'data:image/png;base64,' + fs.readFileSync(icon192Path).toString('base64');

const manifestObj = {
  "name": "AnimalFinderConnect",
  "short_name": "AFC",
  "id": "./?v=7",
  "description": "日本動物共助機構（AFC）による迷子ペット捜索プラットフォーム",
  "start_url": "./index.html?v=7",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0B5394",
  "theme_color": "#0B5394",
  "prefer_related_applications": false,
  "icons": [
    {
      "src": b64_512,
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": b64_192,
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
};

const manifestJsonStr = JSON.stringify(manifestObj, null, 2);

fs.writeFileSync(path.join(ROOT, 'manifest.json'), manifestJsonStr, 'utf8');
fs.writeFileSync(path.join(SUB, 'manifest.json'), manifestJsonStr, 'utf8');

console.log('⚡ BASE64 DIRECT MANIFEST EMBEDDED SUCCESSFULLY!');

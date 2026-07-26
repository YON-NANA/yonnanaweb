const fs = require('fs');
const path = require('path');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const ROOT  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB   = path.join(ROOT, 'afc-pet-finder');

const srcImage = path.join(BRAIN, 'afc_ultra_huge_icon_1785066645300.png');
const b64 = 'data:image/png;base64,' + fs.readFileSync(srcImage).toString('base64');

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
      "src": b64,
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": b64,
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
};

const manifestJsonStr = JSON.stringify(manifestObj, null, 2);

fs.writeFileSync(path.join(ROOT, 'manifest.json'), manifestJsonStr, 'utf8');
fs.writeFileSync(path.join(SUB, 'manifest.json'), manifestJsonStr, 'utf8');

console.log('⚡ PERFECT! BASE64 EMBEDDED MANIFEST GENERATED DIRECTLY FROM BRAIN PNG!');

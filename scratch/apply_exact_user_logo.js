const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const ROOT  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB   = path.join(ROOT, 'afc-pet-finder');

const userLogoPath = path.join(BRAIN, 'media__1785103777553.png');
const tmpScript = path.join(SUB, 'scratch', '_tmp_resizer.ps1');

// Target paths
const target512_root = path.join(ROOT, 'assets', 'afc-logo-full.png');
const target512_sub  = path.join(SUB, 'assets', 'afc-logo-full.png');
const icon512_root   = path.join(ROOT, 'assets', 'icon-512.png');
const icon512_sub    = path.join(SUB, 'assets', 'icon-512.png');

// Copy user exact logo to assets/afc-logo-full.png and assets/icon-512.png directly!
fs.copyFileSync(userLogoPath, target512_root);
fs.copyFileSync(userLogoPath, target512_sub);
fs.copyFileSync(userLogoPath, icon512_root);
fs.copyFileSync(userLogoPath, icon512_sub);

// Read Base64 Data URI of this exact user logo
const b64 = 'data:image/png;base64,' + fs.readFileSync(userLogoPath).toString('base64');

// Manifest v11 with exact user logo
const manifestObj = {
  "name": "AnimalFinderConnect",
  "short_name": "AFC",
  "id": "./?v=11",
  "description": "日本動物共助機構（AFC）による迷子ペット捜索プラットフォーム",
  "start_url": "./index.html?v=11",
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
    },
    {
      "src": "assets/afc-logo-full.png?v=11",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/icon-512.png?v=11",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
};

const manifestJsonStr = JSON.stringify(manifestObj, null, 2);

fs.writeFileSync(path.join(ROOT, 'manifest.json'), manifestJsonStr, 'utf8');
fs.writeFileSync(path.join(SUB, 'manifest.json'), manifestJsonStr, 'utf8');

console.log('🎉 EXACT USER LOGO APPLIED TO ALL ASSETS & MANIFEST V11!');

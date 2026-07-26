const fs = require('fs');
const path = require('path');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const ROOT  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB   = path.join(ROOT, 'afc-pet-finder');

const siteLogoPath = path.join(BRAIN, 'media__1785104088043.png'); // 緑赤青のサイト用ロゴ
const iconLogoPath = path.join(BRAIN, 'media__1785104162661.png'); // 青地に白抜きのアプリ用アイコン

// 1. Webサイト用ロゴ (緑赤青) を配置
const siteLogoRoot = path.join(ROOT, 'assets', 'afc-logo-full.png');
const siteLogoSub  = path.join(SUB, 'assets', 'afc-logo-full.png');
fs.copyFileSync(siteLogoPath, siteLogoRoot);
fs.copyFileSync(siteLogoPath, siteLogoSub);

// 2. ホーム画面アイコン用 (青地に白抜き) を配置
const iconLogoRoot = path.join(ROOT, 'assets', 'pwa-icon.png');
const iconLogoSub  = path.join(SUB, 'assets', 'pwa-icon.png');
const icon512Root  = path.join(ROOT, 'assets', 'icon-512.png');
const icon512Sub   = path.join(SUB, 'assets', 'icon-512.png');

fs.copyFileSync(iconLogoPath, iconLogoRoot);
fs.copyFileSync(iconLogoPath, iconLogoSub);
fs.copyFileSync(iconLogoPath, icon512Root);
fs.copyFileSync(iconLogoPath, icon512Sub);

// Read PWA App Icon as Base64 Data URI
const b64Icon = 'data:image/png;base64,' + fs.readFileSync(iconLogoPath).toString('base64');

// Configure Manifest v12 specifically for Home Screen Icon
const manifestObj = {
  "name": "AnimalFinderConnect",
  "short_name": "AFC",
  "id": "./?v=12",
  "description": "日本動物共助機構（AFC）による迷子ペット捜索プラットフォーム",
  "start_url": "./index.html?v=12",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0B5394",
  "theme_color": "#0B5394",
  "prefer_related_applications": false,
  "icons": [
    {
      "src": b64Icon,
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": b64Icon,
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/pwa-icon.png?v=12",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/icon-512.png?v=12",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
};

const manifestJsonStr = JSON.stringify(manifestObj, null, 2);

fs.writeFileSync(path.join(ROOT, 'manifest.json'), manifestJsonStr, 'utf8');
fs.writeFileSync(path.join(SUB, 'manifest.json'), manifestJsonStr, 'utf8');

console.log('✅ PERFECT SEPARATION COMPLETED!');
console.log('1. Site Logo: Green/Red/Blue AFC logo (assets/afc-logo-full.png)');
console.log('2. App Icon:  Blue white-out AFC logo (assets/pwa-icon.png & manifest.json v12)');

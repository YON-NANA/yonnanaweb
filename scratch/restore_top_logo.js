const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\732117e8-a9f4-4ec8-8796-74a4c8b5d20a\\.user_uploaded\\media_1786930463984.png';
const projectDir = path.resolve(__dirname, '..');
const assetsDir = path.join(projectDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// TOPロゴを配置
fs.copyFileSync(srcPath, path.join(assetsDir, 'afc-logo-full.png'));
fs.copyFileSync(srcPath, path.join(assetsDir, 'afc-logo.png'));
fs.copyFileSync(srcPath, path.join(projectDir, 'afc-logo.png'));

console.log('Successfully copied TOP logo to:');
console.log(' - assets/afc-logo-full.png');
console.log(' - assets/afc-logo.png');
console.log(' - afc-logo.png');

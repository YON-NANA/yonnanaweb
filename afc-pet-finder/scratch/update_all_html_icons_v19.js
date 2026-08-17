const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

const iconBlock = `  <!-- PWA & App Icon -->
  <link rel="manifest" href="manifest.json?v=19">
  <link rel="icon" type="image/x-icon" href="favicon.ico?v=19">
  <link rel="shortcut icon" href="favicon.ico?v=19">
  <link rel="icon" type="image/png" sizes="512x512" href="icons/icon-512.png?v=19">
  <link rel="icon" type="image/png" sizes="256x256" href="icons/icon-256.png?v=19">
  <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png?v=19">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32.png?v=19">
  <link rel="icon" type="image/png" sizes="16x16" href="icons/icon-16.png?v=19">
  <link rel="apple-touch-icon" sizes="180x180" href="icons/icon-180.png?v=19">
  <link rel="apple-touch-icon" href="icons/icon-512.png?v=19">`;

htmlFiles.forEach(file => {
  const filePath = path.join(projectDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // manifest.jsonのバージョン更新
  content = content.replace(/manifest\.json(\?v=\d+)?/g, 'manifest.json?v=19');
  content = content.replace(/favicon\.ico(\?v=\d+)?/g, 'favicon.ico?v=19');
  content = content.replace(/icons\/icon-([^"']+)\.png(\?v=\d+)?/g, 'icons/icon-$1.png?v=19');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated icons in ${file}`);
});

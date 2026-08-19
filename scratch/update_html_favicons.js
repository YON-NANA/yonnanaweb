const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const faviconBlock = `  <!-- PWA & App Icon -->
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="icons/icon-16.png">
  <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="icons/icon-192.png">`;

files.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 既存の <!-- PWA & App Icon --> ブロックや、manifest/icon タグの部分を置換
  if (content.includes('<!-- PWA & App Icon -->')) {
    // 置換範囲を特定
    const regex = /<!-- PWA & App Icon -->[\s\S]*?(?=\s*<meta name="apple-mobile-web-app-capable"|\s*<style|\s*<\/head>)/;
    content = content.replace(regex, faviconBlock + '\n');
  } else if (content.includes('<link rel="manifest"')) {
    const regex = /<link rel="manifest"[\s\S]*?(?=\s*<meta name="apple-mobile-web-app-capable"|\s*<style|\s*<\/head>)/;
    content = content.replace(regex, faviconBlock + '\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated HTML: ${file}`);
});

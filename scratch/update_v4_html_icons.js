const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const iconTags = `  <!-- PWA & App Icon -->
  <link rel="manifest" href="manifest.json?v=4">
  <link rel="icon" type="image/x-icon" href="favicon.ico?v=4">
  <link rel="shortcut icon" href="favicon.ico?v=4">
  <link rel="icon" type="image/png" sizes="256x256" href="icons/icon-256.png?v=4">
  <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32.png?v=4">
  <link rel="icon" type="image/png" sizes="16x16" href="icons/icon-16.png?v=4">
  <link rel="apple-touch-icon" sizes="180x180" href="icons/icon-180.png?v=4">`;

files.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('<!-- PWA & App Icon -->')) {
    const regex = /<!-- PWA & App Icon -->[\s\S]*?(?=<meta name="apple-mobile|<style|<\/head>)/i;
    content = content.replace(regex, iconTags + '\n\n  ');
  } else {
    content = content.replace('</head>', `${iconTags}\n</head>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated v4 icons in ${file}`);
});

console.log('🚀 All HTML files updated with v4 cache-busted icon links!');

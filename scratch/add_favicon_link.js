const fs = require('fs');
const path = require('path');

const targetDir = __dirname + '/..';

const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(targetDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('<link rel="icon"')) {
    // apple-touch-icon の前に favicon リンクを挿入
    content = content.replace(
      /<link rel="apple-touch-icon"/g,
      '<link rel="icon" type="image/png" href="/icons/icon-192.png">\n  <link rel="apple-touch-icon"'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated favicon in ${file}`);
  }
});

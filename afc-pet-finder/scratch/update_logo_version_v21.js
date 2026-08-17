const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(projectDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // assets/afc-logo-full.png のバージョンを更新
  content = content.replace(/assets\/afc-logo-full\.png(\?v=\d+)?/g, 'assets/afc-logo-full.png?v=21');
  content = content.replace(/assets\/afc-logo\.png(\?v=\d+)?/g, 'assets/afc-logo.png?v=21');
  content = content.replace(/css\/style\.css(\?v=\d+)?/g, 'css/style.css?v=21');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated logo version in ${file}`);
});

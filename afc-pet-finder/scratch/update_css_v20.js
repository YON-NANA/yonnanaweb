const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(projectDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/css\/style\.css(\?v=\d+)?/g, 'css/style.css?v=20');
  content = content.replace(/manifest\.json(\?v=\d+)?/g, 'manifest.json?v=20');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated CSS cache to v20 in ${file}`);
});

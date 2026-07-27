const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('href="css/style.css"')) {
      content = content.replaceAll('href="css/style.css"', 'href="css/style.css?v=13"');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${file}`);
      count++;
    } else if (content.includes('href="css/style.css?v=')) {
      content = content.replace(/href="css\/style\.css\?v=\d+"/g, 'href="css/style.css?v=13"');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated query version: ${file}`);
      count++;
    }
  }
});

// sw.js も v13 に更新
const swPath = path.join(dir, 'sw.js');
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(/v\d+/g, 'v13');
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('Updated sw.js to v13');
}

console.log(`Finished updating ${count} HTML files.`);

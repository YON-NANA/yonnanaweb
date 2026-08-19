const fs = require('fs');
const path = require('path');

const targetDir = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

fs.readdirSync(targetDir).forEach(file => {
    if (!file.endsWith('.html')) return;
    const filePath = path.join(targetDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // manifest リンクの修正
    content = content.replace(/<link rel="manifest" href="manifest\.json">/g, '<link rel="manifest" href="/manifest.json">');
    // apple-touch-icon リンクの修正
    content = content.replace(/<link rel="apple-touch-icon" href="icons\/afc-logo\.png">/g, '<link rel="apple-touch-icon" href="/icons/icon-192.png">');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated links in: ${file}`);
});

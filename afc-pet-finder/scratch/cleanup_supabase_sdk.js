const fs = require('fs');
const path = require('path');

const targetDir = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

fs.readdirSync(targetDir).forEach(file => {
    if (!file.endsWith('.html')) return;
    const filePath = path.join(targetDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const original = content;

    // Supabase CDN タグを除去
    content = content.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js[^"]*"><\/script>\n?/g, '');
    // supabase-init.js の読み込みを除去
    content = content.replace(/<script src="js\/supabase-init\.js"><\/script>\n?/g, '');
    // api.js はそのまま残す（念のためダブり除去）
    const apiTag = '<script src="js/api.js"></script>';
    const count = (content.match(/<script src="js\/api\.js"><\/script>/g) || []).length;
    if (count > 1) {
        content = content.replace(/<script src="js\/api\.js"><\/script>\n?/g, '');
        content = content.replace('</body>', apiTag + '\n</body>');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned: ${file}`);
    } else {
        console.log(`No change: ${file}`);
    }
});

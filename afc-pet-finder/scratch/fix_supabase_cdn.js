const fs = require('fs');
const path = require('path');

const targetDir = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

// 旧CDN URL → 新CDN URL (UMD形式で window.supabase として公開される)
const oldTag = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>';
const newTag = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>';

fs.readdirSync(targetDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(targetDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes(oldTag)) {
            content = content.replaceAll(oldTag, newTag);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated CDN: ${file}`);
        } else if (content.includes('supabase-js@2')) {
            console.log(`Already using different URL or not found: ${file}`);
        }
    }
});

const fs = require('fs');
const path = require('path');

const targetDir = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';
const supabaseTags = `
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-init.js"></script>
<script src="js/api.js"></script>
`;

fs.readdirSync(targetDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(targetDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('supabase-js@2')) {
            content = content.replace(/<\/body>/i, `${supabaseTags}</body>`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${file}`);
        } else {
            console.log(`Skipped: ${file}`);
        }
    }
});

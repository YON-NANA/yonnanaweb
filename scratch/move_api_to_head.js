const fs = require('fs');
const path = require('path');

const targetDir = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';
const apiTag = '<script src="js/api.js"></script>';
// <head> 内の最後（</head>の直前）に移動する
const newHeadTag = '  <script src="js/api.js" defer></script>\n</head>';

fs.readdirSync(targetDir).forEach(file => {
    if (!file.endsWith('.html')) return;
    const filePath = path.join(targetDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes(apiTag)) return; // api.js がない場合はスキップ

    // </body> 直前から api.js タグを除去
    content = content.replace(/\n?<script src="js\/api\.js"><\/script>\n?/g, '\n');
    
    // </head> の直前に defer 付きで挿入（まだ入っていなければ）
    if (!content.includes('js/api.js')) {
        content = content.replace('</head>', newHeadTag);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Moved api.js to head: ${file}`);
});

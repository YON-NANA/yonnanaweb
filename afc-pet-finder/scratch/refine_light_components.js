const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

function refineCss(cssPath) {
  if (!fs.existsSync(cssPath)) return;
  let css = fs.readFileSync(cssPath, 'utf8');

  // Replace hardcoded dark background overlays & component styles with clean light theme styles
  css = css.replace(/background:\s*rgba\(8,\s*15,\s*26,\s*0\.\d+\);?/g, 'background: rgba(255, 255, 255, 0.95);');
  css = css.replace(/background:\s*#080F1A;?/g, 'background: #F4F7F6;');
  css = css.replace(/background:\s*#0D1B2A;?/g, 'background: #FFFFFF;');
  
  // Ensure nav background is clean white with soft shadow
  css = css.replace(/\.nav\s*\{[\s\S]*?\}/g, `.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  transition: var(--transition-normal);
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}`);

  fs.writeFileSync(cssPath, css, 'utf8');
  console.log(`Refined light components in: ${cssPath}`);
}

refineCss(path.join(ROOT, 'css', 'style.css'));
refineCss(path.join(SUB, 'css', 'style.css'));

console.log('✨ All component styles refined for bright, reassuring light mode!');

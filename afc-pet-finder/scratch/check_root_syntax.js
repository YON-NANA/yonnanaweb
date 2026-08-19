const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const files = ['lost-register.html', 'found-register.html', 'poster.html', 'map.html', 'index.html', 'js/api.js'];

let hasError = false;

for (const file of files) {
  const fullPath = path.join(rootDir, file);
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (file.endsWith('.js')) {
    try {
      new Function(content);
      console.log(`✅ Root ${file}: JS Syntax OK`);
    } catch(e) {
      console.error(`❌ Root ${file}: JS Syntax Error:`, e.message);
      hasError = true;
    }
  } else {
    const scripts = content.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
    scripts.forEach((s, idx) => {
      const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
      try {
        new Function(code);
        console.log(`✅ Root ${file} (inline script #${idx+1}): JS Syntax OK`);
      } catch(e) {
        console.error(`❌ Root ${file} (inline script #${idx+1}): JS Syntax Error:`, e.message);
        hasError = true;
      }
    });
  }
}

if (!hasError) {
  console.log('\nAll ROOT syntax checks PASSED! 🎉');
}

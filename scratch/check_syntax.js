const fs = require('fs');

const files = ['lost-register.html', 'found-register.html', 'poster.html', 'map.html', 'index.html', 'js/api.js'];

let hasError = false;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  if (file.endsWith('.js')) {
    try {
      new Function(content);
      console.log(`✅ ${file}: JS Syntax OK`);
    } catch(e) {
      console.error(`❌ ${file}: JS Syntax Error:`, e.message);
      hasError = true;
    }
  } else {
    const scripts = content.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
    scripts.forEach((s, idx) => {
      const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
      try {
        new Function(code);
        console.log(`✅ ${file} (inline script #${idx+1}): JS Syntax OK`);
      } catch(e) {
        console.error(`❌ ${file} (inline script #${idx+1}): JS Syntax Error:`, e.message);
        hasError = true;
      }
    });
  }
}

if (!hasError) {
  console.log('\nAll syntax checks PASSED! 🎉');
}

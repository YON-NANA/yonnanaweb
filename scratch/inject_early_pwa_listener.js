const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

const htmlFiles = [
  'index.html',
  'map.html',
  'match.html',
  'admin-data.html',
  'chat.html',
  'lost-register.html',
  'found-register.html',
  'poster.html',
  'guide.html',
  'privacy.html',
  'terms.html'
];

const scriptTag = `<script>
  window.deferredPrompt = window.deferredPrompt || null;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    window.deferredPrompt = e;
    console.log('⚡ Early beforeinstallprompt captured!');
  });
</script>\n`;

function injectScript(dir) {
  htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes('Early beforeinstallprompt captured')) {
        // Inject right after <head> or <!DOCTYPE html>
        if (content.includes('<head>')) {
          content = content.replace('<head>', '<head>\n  ' + scriptTag);
        } else {
          content = scriptTag + content;
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injected early listener to: ${file}`);
      }
    }
  });
}

injectScript(ROOT);
injectScript(SUB);

console.log('🎉 Early beforeinstallprompt listener injected into all HTML files!');

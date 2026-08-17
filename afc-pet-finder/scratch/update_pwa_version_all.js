const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Update manifest version
  content = content.replace(/href=["']manifest\.json(?:\?v=\d+)?["']/g, 'href="manifest.json?v=14"');

  // Update style.css version
  content = content.replace(/href=["']css\/style\.css(?:\?v=\d+)?["']/g, 'href="css/style.css?v=14"');

  // Ensure early beforeinstallprompt listener is present at start of head
  if (!content.includes('Early beforeinstallprompt captured')) {
    const earlyScript = `<script>
  window.deferredPrompt = window.deferredPrompt || null;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    window.deferredPrompt = e;
    console.log('⚡ Early beforeinstallprompt captured!');
  });
</script>\n`;
    content = content.replace('<head>', '<head>\n  ' + earlyScript);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated PWA links in ${file}`);
});

console.log('All HTML files updated successfully!');

const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

// 1. Fix Top Page Map in index.html and index_test.html
function fixTopMap(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  const oldDarkTile = `L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO'
    }).addTo(map);`;

  const newBrightTile = `L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);`;

  if (html.includes('dark_all')) {
    html = html.replaceAll(oldDarkTile, newBrightTile);
    // Also catch any single quote or general variations
    html = html.replace(/https:\/\/\{s\}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png/g, 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Fix top map in: ${filePath}`);
  }
}

fixTopMap(path.join(ROOT, 'index.html'));
fixTopMap(path.join(SUB, 'index.html'));
fixTopMap(path.join(ROOT, 'index_test.html'));
fixTopMap(path.join(SUB, 'index_test.html'));
fixTopMap(path.join(ROOT, 'lost-register.html'));
fixTopMap(path.join(SUB, 'lost-register.html'));
fixTopMap(path.join(ROOT, 'found-register.html'));
fixTopMap(path.join(SUB, 'found-register.html'));

// 2. Darken and contrast-enhance CSS variables in style.css for better legibility and rich tone
function darkenTheme(cssPath) {
  if (!fs.existsSync(cssPath)) return;
  let css = fs.readFileSync(cssPath, 'utf8');

  const richThemeVariables = `:root {
  /* Brand Colors */
  --primary:       #166534;
  --primary-light: #22C55E;
  --primary-dark:  #14532D;
  --gold:          #D97706;
  --gold-light:    #F59E0B;
  --gold-dark:     #B45309;

  /* Status Colors */
  --lost:    #EA580C;
  --found:   #16A34A;
  --witness: #0284C7;
  --alert:   #DC2626;
  --match:   #9333EA;

  /* Backgrounds (Richer Contrast Light-Medium Tone) */
  --bg-deep:    #E2E8F0;
  --bg-dark:    #FFFFFF;
  --bg-card:    #FFFFFF;
  --bg-card-hover: #F1F5F9;
  --bg-input:   #F8FAFC;
  --bg-overlay: rgba(255, 255, 255, 0.95);

  /* Glass Effects */
  --glass-bg:     rgba(255, 255, 255, 0.95);
  --glass-border: rgba(15, 23, 42, 0.12);
  --glass-blur:   blur(12px);

  /* Text Colors for Crisp High Contrast Legibility */
  --text-primary:   #0F172A;
  --text-secondary: #334155;
  --text-muted:     #64748B;
  --text-gold:      #B45309;

  /* Borders & Shadows (Clearer & Sharper) */
  --border:       rgba(15, 23, 42, 0.12);
  --border-focus: rgba(22, 101, 52, 0.6);

  --shadow-sm: 0 2px 6px rgba(15,23,42,0.06);
  --shadow-md: 0 8px 24px rgba(15,23,42,0.09);
  --shadow-lg: 0 16px 40px rgba(15,23,42,0.14);
  --shadow-gold: 0 0 20px rgba(217,119,6,0.20);
  --shadow-green: 0 0 20px rgba(22,101,52,0.20);

  --space-xs:  0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   20px;
  --radius-xl:   32px;
  --radius-full: 9999px;

  --transition-fast:   0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow:   0.5s ease;

  --font-jp:   'Noto Sans JP', sans-serif;
  --font-en:   'Outfit', sans-serif;

  --nav-height: 72px;
}`;

  css = css.replace(/:root\s*\{[\s\S]*?--nav-height:\s*72px;\s*\}/g, richThemeVariables);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log(`Darkened & enhanced contrast in: ${cssPath}`);
}

darkenTheme(path.join(ROOT, 'css', 'style.css'));
darkenTheme(path.join(SUB, 'css', 'style.css'));

console.log('🎉 TOP MAP FIXED & RICHER CONTRAST THEME APPLIED SUCCESSFULLY!');

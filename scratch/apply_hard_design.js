/**
 * AFC Pet Finder — Hard Design Restyle Script
 * フォント・カラー・角丸・シャドウ・マップタイルを一括変更
 */
const fs = require('fs');
const path = require('path');

const ROOT    = 'C:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUBDIR  = path.join(ROOT, 'afc-pet-finder');

// ─── 1. CSS 更新 ────────────────────────────────────────────────────

const OLD_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap');`;
const NEW_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Noto+Sans+JP:wght@400;500;600;700;900&display=swap');`;

const OLD_LEAFLET_TOP = `.leaflet-container { background: #BFDBFE !important; }`;
const NEW_LEAFLET_TOP = `.leaflet-container { background: #E8ECF0 !important; }`;

// body::before gradient — remove soft glow, replace with flat subtle tint
const OLD_BODY_BEFORE = `/* Animated background */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 10%, rgba(14, 165, 233, 0.35) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 80% 80%, rgba(56, 189, 248, 0.30) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(125, 211, 252, 0.25) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}`;
const NEW_BODY_BEFORE = `/* Background — flat, no glow */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: none;
  pointer-events: none;
  z-index: 0;
}`;

// Leaflet override section
const OLD_LEAFLET_SECTION = `/* ─── Leaflet Overrides ─── */
.leaflet-container { background: #BFDBFE !important; }
.leaflet-tile-pane {
  filter: hue-rotate(195deg) saturate(1.5) contrast(0.93) brightness(1.05);
}`;
const NEW_LEAFLET_SECTION = `/* ─── Leaflet Overrides ─── */
.leaflet-container { background: #E8ECF0 !important; }
.leaflet-tile-pane {
  filter: grayscale(0.15) contrast(1.08) saturate(0.85) brightness(1.0);
}`;

// CSS Variables block replacement
const OLD_VARS = `/* ─── CSS Variables ─── */
:root {
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

  /* Backgrounds (Clear Sky Blue) */
  --bg-deep:    #BAE6FD;
  --bg-dark:    #FFFFFF;
  --bg-card:    #FFFFFF;
  --bg-card-hover: #E0F2FE;
  --bg-input:   #F0F9FF;
  --bg-overlay: rgba(255, 255, 255, 0.95);

  /* Glass Effects */
  --glass-bg:     rgba(255, 255, 255, 0.95);
  --glass-border: rgba(2, 132, 199, 0.30);
  --glass-blur:   blur(12px);

  /* Text Colors for Maximum High Contrast Legibility */
  --text-primary:   #0C1A2E;
  --text-secondary: #1E293B;
  --text-muted:     #374151;
  --text-gold:      #92400E;

  /* Borders & Shadows (Clearer & Sharper) */
  --border:       rgba(2, 132, 199, 0.28);
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

const NEW_VARS = `/* ─── CSS Variables ─── */
:root {
  /* Brand Colors — Deep Navy/Steel Blue */
  --primary:       #1E40AF;
  --primary-light: #3B82F6;
  --primary-dark:  #1E3A8A;
  --gold:          #B45309;
  --gold-light:    #D97706;
  --gold-dark:     #92400E;

  /* Status Colors */
  --lost:    #DC2626;
  --found:   #15803D;
  --witness: #1D4ED8;
  --alert:   #991B1B;
  --match:   #7C3AED;

  /* Backgrounds — Structured Steel Blue-Gray */
  --bg-deep:    #CBD5E1;
  --bg-dark:    #F8FAFC;
  --bg-card:    #FFFFFF;
  --bg-card-hover: #F1F5F9;
  --bg-input:   #F8FAFC;
  --bg-overlay: rgba(255, 255, 255, 0.98);

  /* Glass Effects — Flat, No Blur */
  --glass-bg:     rgba(255, 255, 255, 0.99);
  --glass-border: rgba(15, 23, 42, 0.22);
  --glass-blur:   blur(0px);

  /* Text Colors */
  --text-primary:   #0F172A;
  --text-secondary: #1E293B;
  --text-muted:     #475569;
  --text-gold:      #92400E;

  /* Borders — Visible, Sharp */
  --border:       rgba(15, 23, 42, 0.18);
  --border-focus: #1E40AF;

  /* Shadows — Hard Drop Shadow */
  --shadow-sm: 0 1px 3px rgba(15,23,42,0.14), 0 1px 2px rgba(15,23,42,0.10);
  --shadow-md: 0 4px 6px rgba(15,23,42,0.12), 0 2px 4px rgba(15,23,42,0.08);
  --shadow-lg: 0 10px 15px rgba(15,23,42,0.14), 0 4px 6px rgba(15,23,42,0.08);
  --shadow-gold: 0 2px 8px rgba(180,83,9,0.30);
  --shadow-green: 0 2px 8px rgba(30,64,175,0.30);

  --space-xs:  0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Border Radius — Sharp & Angular */
  --radius-sm:   3px;
  --radius-md:   4px;
  --radius-lg:   6px;
  --radius-xl:   10px;
  --radius-full: 9999px;

  --transition-fast:   0.10s ease;
  --transition-normal: 0.2s ease;
  --transition-slow:   0.35s ease;

  --font-jp:   'Noto Sans JP', sans-serif;
  --font-en:   'IBM Plex Sans', sans-serif;

  --nav-height: 64px;
}`;

function updateCss(filePath) {
  if (!fs.existsSync(filePath)) { console.warn('CSS not found:', filePath); return; }
  let content = fs.readFileSync(filePath, 'utf8');

  // Font import
  if (content.includes(OLD_IMPORT)) {
    content = content.replace(OLD_IMPORT, NEW_IMPORT);
    console.log(`  ✓ Font import updated`);
  } else {
    console.warn(`  ⚠ Font import not found in ${path.basename(filePath)}`);
  }

  // Leaflet top
  if (content.includes(OLD_LEAFLET_TOP)) {
    content = content.replace(OLD_LEAFLET_TOP, NEW_LEAFLET_TOP);
  }

  // CSS Variables
  if (content.includes('--radius-sm:   8px;')) {
    content = content.replace(OLD_VARS, NEW_VARS);
    console.log(`  ✓ CSS variables updated`);
  } else {
    console.warn(`  ⚠ CSS variables not matched in ${path.basename(filePath)}`);
  }

  // body::before gradient
  if (content.includes('Animated background')) {
    content = content.replace(OLD_BODY_BEFORE, NEW_BODY_BEFORE);
    console.log(`  ✓ Background gradient removed`);
  }

  // Leaflet section
  if (content.includes('hue-rotate(195deg)')) {
    content = content.replace(OLD_LEAFLET_SECTION, NEW_LEAFLET_SECTION);
    console.log(`  ✓ Leaflet tile filter updated`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Saved: ${filePath}\n`);
}

// ─── 2. Map tile URL 更新 ─────────────────────────────────────────────

const OLD_TILE_VOYAGER = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`;
const NEW_TILE_POSITRON = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`;

function updateHtmlTiles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(OLD_TILE_VOYAGER)) return;
  content = content.replaceAll(OLD_TILE_VOYAGER, NEW_TILE_POSITRON);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ Tile URL updated: ${path.basename(filePath)}`);
}

// ─── 3. ナビ高さ line-height 調整 ──────────────────────────────────────

function updateHeadings(cssPath) {
  if (!fs.existsSync(cssPath)) return;
  let content = fs.readFileSync(cssPath, 'utf8');
  // tighten heading line-height for harder feel
  content = content.replace('line-height: 1.2;', 'line-height: 1.1;');
  // tighten body line-height
  content = content.replace('line-height: 1.7;', 'line-height: 1.6;');
  // font-weight bump on headings
  content = content.replace('font-weight: 700;\n  line-height: 1.1;', 'font-weight: 700;\n  line-height: 1.1;\n  letter-spacing: -0.01em;');
  fs.writeFileSync(cssPath, content, 'utf8');
  console.log(`  ✓ Typography tightened`);
}

// ─── 実行 ────────────────────────────────────────────────────────────

console.log('\n=== Updating ROOT css/style.css ===');
const rootCss = path.join(ROOT, 'css', 'style.css');
updateCss(rootCss);
updateHeadings(rootCss);

console.log('\n=== Updating SUBDIR css/style.css ===');
const subCss = path.join(SUBDIR, 'css', 'style.css');
updateCss(subCss);
updateHeadings(subCss);

console.log('\n=== Updating Map Tiles in HTML files ===');
const htmlDirs = [ROOT, SUBDIR];
htmlDirs.forEach(dir => {
  fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
    updateHtmlTiles(path.join(dir, f));
  });
});

console.log('\n✅ Hard Design restyle complete!');

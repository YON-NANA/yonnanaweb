const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

// 1. Update CSS style.css variables and remove dark map invert filters
function updateCss(cssPath) {
  if (!fs.existsSync(cssPath)) return;
  let css = fs.readFileSync(cssPath, 'utf8');

  // Remove dark mode Leaflet filters
  css = css.replace(/\.leaflet-container\s*\{[\s\S]*?\}/g, '.leaflet-container { background: #E5E9EC !important; }');
  css = css.replace(/\.detailed-view\s+\.leaflet-layer[\s\S]*?\{[\s\S]*?\}/g, '');

  // Replace dark variables with warm, bright, clear light theme variables
  const newVariables = `:root {
  /* Brand Colors */
  --primary:       #1E7E4E;
  --primary-light: #2ECC71;
  --primary-dark:  #145A36;
  --gold:          #D97706;
  --gold-light:    #F59E0B;
  --gold-dark:     #B45309;

  /* Status Colors */
  --lost:    #E65100;
  --found:   #2E7D32;
  --witness: #0288D1;
  --alert:   #D32F2F;
  --match:   #7B1FA2;

  /* Backgrounds (Warm Bright Light Theme) */
  --bg-deep:    #F4F7F6;
  --bg-dark:    #FFFFFF;
  --bg-card:    #FFFFFF;
  --bg-card-hover: #EDF4F0;
  --bg-input:   #F0F4F2;
  --bg-overlay: rgba(255, 255, 255, 0.95);

  /* Glass Effects for Light Mode */
  --glass-bg:     rgba(255, 255, 255, 0.90);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-blur:   blur(12px);

  /* Text Colors for High Contrast Legibility */
  --text-primary:   #0F172A;
  --text-secondary: #475569;
  --text-muted:     #64748B;
  --text-gold:      #B45309;

  /* Borders & Shadows */
  --border:       rgba(0, 0, 0, 0.08);
  --border-focus: rgba(30, 126, 78, 0.6);

  --shadow-sm: 0 2px 6px rgba(0,0,0,0.04);
  --shadow-md: 0 6px 20px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 36px rgba(0,0,0,0.10);
  --shadow-gold: 0 0 20px rgba(217,119,6,0.15);
  --shadow-green: 0 0 20px rgba(30,126,78,0.15);

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

  css = css.replace(/:root\s*\{[\s\S]*?--nav-height:\s*72px;\s*\}/g, newVariables);

  fs.writeFileSync(cssPath, css, 'utf8');
  console.log(`Updated CSS theme in: ${cssPath}`);
}

updateCss(path.join(ROOT, 'css', 'style.css'));
updateCss(path.join(SUB, 'css', 'style.css'));

// 2. Update map.html to use bright clear OSM / Voyager map tiles
function updateMapHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace dark tiles with bright CartoDB Voyager tiles
  const oldTileCode = `const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO'
    });
    
    const osmTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    function updateMapStyle() {
      const zoom = map.getZoom();
      if (zoom >= 15) {
        if (map.hasLayer(darkTiles)) map.removeLayer(darkTiles);
        if (!map.hasLayer(osmTiles)) map.addLayer(osmTiles);
        container.classList.add('detailed-view');
      } else {
        if (map.hasLayer(osmTiles)) map.removeLayer(osmTiles);
        if (!map.hasLayer(darkTiles)) map.addLayer(darkTiles);
        container.classList.remove('detailed-view');
      }
    }

    map.on('zoomend', updateMapStyle);
    updateMapStyle();`;

  const newTileCode = `const brightTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);`;

  if (content.includes('darkTiles')) {
    content = content.replace(oldTileCode, newTileCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated map tiles to bright Voyager tiles in: ${filePath}`);
  }
}

updateMapHtml(path.join(ROOT, 'map.html'));
updateMapHtml(path.join(SUB, 'map.html'));
updateMapHtml(path.join(ROOT, 'index.html'));
updateMapHtml(path.join(SUB, 'index.html'));

console.log('🎉 WARM BRIGHT THEME & CLEAR MAP TILES APPLIED SUCCESSFULLY!');

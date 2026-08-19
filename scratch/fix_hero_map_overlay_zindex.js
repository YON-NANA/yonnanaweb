const fs = require('fs');
const path = require('path');

const ROOT = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB  = path.join(ROOT, 'afc-pet-finder');

function fixOverlay(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace hero-map-overlay z-index and map-badge background with high z-index & clean light style
  const oldOverlayStyle = `.hero-map-overlay {
      position: absolute;
      top: var(--space-md);
      left: var(--space-md);
      right: var(--space-md);
      z-index: 400;
      display: flex;
      gap: var(--space-sm);
    }

    .map-badge {
      padding: 4px 10px;
      background: rgba(8,15,26,0.85);
      backdrop-filter: blur(10px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }`;

  const newOverlayStyle = `.hero-map-overlay {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      z-index: 1000 !important;
      display: flex;
      gap: 8px;
      pointer-events: none;
    }

    .map-badge {
      pointer-events: auto;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(15, 23, 42, 0.12) !important;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
    }`;

  if (html.includes('.hero-map-overlay')) {
    html = html.replace(oldOverlayStyle, newOverlayStyle);
    // Also handle fallback regex replacement if whitespace differed
    html = html.replace(/z-index:\s*400;/g, 'z-index: 1000 !important;');
    html = html.replace(/background:\s*rgba\(8,15,26,0\.85\);/g, 'background: rgba(255, 255, 255, 0.95) !important;');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Fixed hero map z-index and badge overlay in: ${filePath}`);
  }
}

fixOverlay(path.join(ROOT, 'index.html'));
fixOverlay(path.join(SUB, 'index.html'));
fixOverlay(path.join(ROOT, 'index_test.html'));
fixOverlay(path.join(SUB, 'index_test.html'));

console.log('🎉 HERO MAP OVERLAY Z-INDEX FIXED SUCCESSFULLY!');

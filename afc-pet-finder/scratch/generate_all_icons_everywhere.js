const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const ROOT  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB   = path.join(ROOT, 'afc-pet-finder');

const srcImage = path.join(BRAIN, 'afc_ultra_huge_icon_1785066645300.png');
const tmpScript = path.join(SUB, 'scratch', '_tmp_everywhere.ps1');

const targetDirs = [
  path.join(ROOT, 'icons'),
  path.join(SUB, 'icons'),
  path.join(ROOT, 'assets'),
  path.join(SUB, 'assets'),
  path.join(ROOT, 'img'),
  path.join(SUB, 'img')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function createZoomedImage(srcPath, destPath, targetSize, cropRatio) {
  const ps = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("${srcPath.replace(/\\/g, '\\\\')}")

$origW = $img.Width
$origH = $img.Height

$cropW = [int]($origW * ${cropRatio})
$cropH = [int]($origH * ${cropRatio})
$cropX = [int](($origW - $cropW) / 2)
$cropY = [int](($origH - $cropH) / 2)

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$destRect = New-Object System.Drawing.Rectangle(0, 0, ${targetSize}, ${targetSize})

$bmp = New-Object System.Drawing.Bitmap(${targetSize}, ${targetSize})
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$bmp.Save("${destPath.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
`;

  fs.writeFileSync(tmpScript, ps, 'utf8');
  execSync(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, { stdio: 'inherit' });
  if (fs.existsSync(tmpScript)) fs.unlinkSync(tmpScript);
}

const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];

// Both ROOT/icons and SUB/icons
[path.join(ROOT, 'icons'), path.join(SUB, 'icons')].forEach(dir => {
  for (const s of sizes) {
    createZoomedImage(srcImage, path.join(dir, `icon-${s}.png`), s, 0.42);
  }
  createZoomedImage(srcImage, path.join(dir, 'icon-maskable-512.png'), 512, 0.42);
  createZoomedImage(srcImage, path.join(dir, 'icon-maskable-192.png'), 192, 0.42);
  createZoomedImage(srcImage, path.join(dir, 'afc-logo.png'), 512, 0.42);
});

// assets & img
createZoomedImage(srcImage, path.join(ROOT, 'assets', 'afc-logo-full.png'), 512, 0.42);
createZoomedImage(srcImage, path.join(SUB, 'assets', 'afc-logo-full.png'), 512, 0.42);
createZoomedImage(srcImage, path.join(ROOT, 'img', 'app-icon.png'), 512, 0.42);
createZoomedImage(srcImage, path.join(SUB, 'img', 'app-icon.png'), 512, 0.42);

// Favicon
createZoomedImage(srcImage, path.join(ROOT, 'favicon.ico'), 256, 0.42);
createZoomedImage(srcImage, path.join(SUB, 'favicon.ico'), 256, 0.42);

// Sync manifest and sw.js
fs.copyFileSync(path.join(SUB, 'manifest.json'), path.join(ROOT, 'manifest.json'));
fs.copyFileSync(path.join(SUB, 'sw.js'), path.join(ROOT, 'sw.js'));

console.log('💎 ALL ICONS GENERATED AND SYNCED EVERYWHERE (ROOT AND SUBDIR)!');

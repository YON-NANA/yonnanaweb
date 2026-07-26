const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const ROOT  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB   = path.join(ROOT, 'afc-pet-finder');

const srcImage = path.join(BRAIN, 'afc_ultra_huge_icon_1785066645300.png');
const tmpScript = path.join(SUB, 'scratch', '_tmp_base64.ps1');

// Create a clean 512x512 zoomed PNG and a 192x192 zoomed PNG
const img512Path = path.join(SUB, 'scratch', 'icon512_temp.png');
const img192Path = path.join(SUB, 'scratch', 'icon192_temp.png');

function makePng(srcPath, destPath, size, cropRatio) {
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
$destRect = New-Object System.Drawing.Rectangle(0, 0, ${size}, ${size})

$bmp = New-Object System.Drawing.Bitmap(${size}, ${size})
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

makePng(srcImage, img512Path, 512, 0.42);
makePng(srcImage, img192Path, 192, 0.42);

// Read files as Base64 Data URI
const b64_512 = 'data:image/png;base64,' + fs.readFileSync(img512Path).toString('base64');
const b64_192 = 'data:image/png;base64,' + fs.readFileSync(img192Path).toString('base64');

// Clean up temp images
if (fs.existsSync(img512Path)) fs.unlinkSync(img512Path);
if (fs.existsSync(img192Path)) fs.unlinkSync(img192Path);

// Create fully self-contained Base64 Embedded Manifest
const manifestObj = {
  "name": "AnimalFinderConnect",
  "short_name": "AFC",
  "id": "./?v=7",
  "description": "日本動物共助機構（AFC）による迷子ペット捜索プラットフォーム",
  "start_url": "./index.html?v=7",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0B5394",
  "theme_color": "#0B5394",
  "prefer_related_applications": false,
  "icons": [
    {
      "src": b64_512,
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": b64_192,
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
};

const manifestJsonStr = JSON.stringify(manifestObj, null, 2);

// Write manifest.json to both ROOT and SUBDIR
fs.writeFileSync(path.join(ROOT, 'manifest.json'), manifestJsonStr, 'utf8');
fs.writeFileSync(path.join(SUB, 'manifest.json'), manifestJsonStr, 'utf8');

console.log('⚡ BASE64 EMBEDDED MANIFEST CREATED! 100% immune to 404 errors!');

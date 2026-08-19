const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const BASE  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

const ultraSrc = path.join(BRAIN, 'afc_ultra_huge_icon_1785066645300.png');
const iconsDir = path.join(BASE, 'icons');
const tmpScript = path.join(BASE, 'scratch', '_tmp_ultra.ps1');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

function runPs(script) {
  fs.writeFileSync(tmpScript, script, 'utf8');
  execSync(`powershell -ExecutionPolicy Bypass -File "${tmpScript}"`, { stdio: 'inherit' });
}

function resizePng(srcPath, destPath, size) {
  runPs(`
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("${srcPath.replace(/\\/g, '\\\\')}")
$bmp = New-Object System.Drawing.Bitmap(${size}, ${size})
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage($img, 0, 0, ${size}, ${size})
$g.Dispose()
$bmp.Save("${destPath.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
`);
  console.log(`OK [${size}x${size}]: ${path.basename(destPath)}`);
}

function resizeIco(srcPath, destPath, size) {
  runPs(`
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("${srcPath.replace(/\\/g, '\\\\')}")
$bmp = New-Object System.Drawing.Bitmap(${size}, ${size})
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, ${size}, ${size})
$g.Dispose()
$h = $bmp.GetHicon()
$ico = [System.Drawing.Icon]::FromHandle($h)
$fs2 = [System.IO.File]::Create("${destPath.replace(/\\/g, '\\\\')}")
$ico.Save($fs2)
$fs2.Close()
$ico.Dispose()
$bmp.Dispose()
$img.Dispose()
`);
  console.log(`OK [ICO ${size}x${size}]: ${path.basename(destPath)}`);
}

// すべてのアイコンを超巨大拡大デザインで統一更新
const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
for (const s of sizes) {
  resizePng(ultraSrc, path.join(iconsDir, `icon-${s}.png`), s);
}
resizePng(ultraSrc, path.join(iconsDir, 'icon-maskable-192.png'), 192);
resizePng(ultraSrc, path.join(iconsDir, 'icon-maskable-512.png'), 512);

resizePng(ultraSrc, path.join(BASE, 'assets', 'afc-logo-full.png'), 512);
resizePng(ultraSrc, path.join(BASE, 'img', 'app-icon.png'), 512);
resizePng(ultraSrc, path.join(iconsDir, 'afc-logo.png'), 512);

resizeIco(ultraSrc, path.join(BASE, 'favicon.ico'), 256);

if (fs.existsSync(tmpScript)) fs.unlinkSync(tmpScript);

console.log('\n🚀 All ultra-huge icons updated successfully!');

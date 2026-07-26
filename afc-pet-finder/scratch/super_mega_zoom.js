const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const BASE  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

const srcImage = path.join(BRAIN, 'afc_ultra_huge_icon_1785066645300.png');
const iconsDir = path.join(BASE, 'icons');
const tmpScript = path.join(BASE, 'scratch', '_tmp_mega_zoom.ps1');

/**
 * cropRatio = 0.42 (中央42%の領域のみを512x512に超拡大！)
 * これにより中央の「犬猫シルエット」と「AFC文字」が画像の縁ギリギリ端まで
 * 2.38倍の超・超・超極大サイズで敷き詰められます。
 * Androidの丸型アイコンで自動縮小されても、文字とイラストが丸枠いっぱいに巨大表示されます。
 */
function createSuperMegaZoomImage(srcPath, destPath, targetSize, cropRatio) {
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

// 全てのアイコンファイルを 0.42 (2.38倍超特大ズーム) の画像で完全上書き更新！
const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
for (const s of sizes) {
  createSuperMegaZoomImage(srcImage, path.join(iconsDir, `icon-${s}.png`), s, 0.42);
}

createSuperMegaZoomImage(srcImage, path.join(iconsDir, 'icon-maskable-512.png'), 512, 0.42);
createSuperMegaZoomImage(srcImage, path.join(iconsDir, 'icon-maskable-192.png'), 192, 0.42);
createSuperMegaZoomImage(srcImage, path.join(BASE, 'assets', 'afc-logo-full.png'), 512, 0.42);
createSuperMegaZoomImage(srcImage, path.join(BASE, 'img', 'app-icon.png'), 512, 0.42);
createSuperMegaZoomImage(srcImage, path.join(iconsDir, 'afc-logo.png'), 512, 0.42);

console.log('💥 Super Mega Zoom (2.38x) Icons Created Successfully!');

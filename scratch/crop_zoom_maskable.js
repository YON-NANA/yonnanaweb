const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const BASE  = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

const srcImage = path.join(BRAIN, 'afc_ultra_huge_icon_1785066645300.png');
const iconsDir = path.join(BASE, 'icons');
const tmpScript = path.join(BASE, 'scratch', '_tmp_crop_zoom.ps1');

/**
 * 画像の中央から cropRatio (例: 0.65 = 中央65%の領域) を切り出して 512x512 に拡大する。
 * これによりロゴマーク（犬猫＋AFC）が約1.53倍に超拡大され、
 * AndroidのSafe Zone (Maskable) で縮小されても、円（〇）の縁ギリギリまで巨大表示される。
 */
function createZoomedImage(srcPath, destPath, targetSize, cropRatio) {
  const ps = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("${srcPath.replace(/\\/g, '\\\\')}")

$origW = $img.Width
$origH = $img.Height

# クロップ範囲の計算（中央部分を切り出し）
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

// 1. Android Maskable 用：中央を 60% 切り出して超・超巨大拡大 (1.66倍ズーム)
createZoomedImage(srcImage, path.join(iconsDir, 'icon-maskable-512.png'), 512, 0.60);
createZoomedImage(srcImage, path.join(iconsDir, 'icon-maskable-192.png'), 192, 0.60);

// 2. 通常 (any) アイコン全サイズも超巨大拡大で作成 (0.65 切り出し)
const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
for (const s of sizes) {
  createZoomedImage(srcImage, path.join(iconsDir, `icon-${s}.png`), s, 0.65);
}

createZoomedImage(srcImage, path.join(BASE, 'assets', 'afc-logo-full.png'), 512, 0.65);
createZoomedImage(srcImage, path.join(BASE, 'img', 'app-icon.png'), 512, 0.65);
createZoomedImage(srcImage, path.join(iconsDir, 'afc-logo.png'), 512, 0.65);

console.log('🎉 Super Zoomed Crop-Maskable Icons Created Successfully!');

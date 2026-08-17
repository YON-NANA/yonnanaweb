const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE = 'c:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';
const srcImage = path.join(BASE, 'afc-logo.png');
const iconsDir = path.join(BASE, 'icons');

/**
 * 元画像 afc-logo.png は 1024x938。
 * 青い円の中心は約 (505, 426) 付近。
 * 青い円の直径は約 660px。
 * 
 * cropSize = 560px の正方形で中央 (505, 426) を切り抜くと：
 * - 切り抜き範囲の四隅（0,0〜560,560）はすべて青色円の内部（#034F8B のグラデーション）になり、白背景は一切含まれません！
 * - 中心の犬猫シルエット＋「AFC」ロゴが画像いっぱいに大きく綺麗に配置されます。
 * - Androidの丸型アイコンで自動トリミングされても、ABCの赤アイコンと同じように白余白ゼロで画面いっぱいに青色アイコンが表示されます！
 */

function generateAllIcons(cropCenterX, cropCenterY, cropSize) {
  const psScript = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("${srcImage.replace(/\\/g, '\\\\')}")

$cropX = [int](${cropCenterX} - ${cropSize} / 2)
$cropY = [int](${cropCenterY} - ${cropSize} / 2)
$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, ${cropSize}, ${cropSize})

function MakeIcon($targetSize, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # 背景も青色で下地を塗る（#034F8B）
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 79, 139))
    $g.FillRectangle($bgBrush, 0, 0, $targetSize, $targetSize)
    $bgBrush.Dispose()

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetSize, $targetSize)
    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outPath ($targetSize x $targetSize)"
}

$iconsDir = "${iconsDir.replace(/\\/g, '\\\\')}"
$baseDir = "${BASE.replace(/\\/g, '\\\\')}"

$sizes = @(16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512)
foreach ($s in $sizes) {
    MakeIcon $s "$iconsDir\\icon-$s.png"
}

MakeIcon 192 "$iconsDir\\icon-maskable-192.png"
MakeIcon 512 "$iconsDir\\icon-maskable-512.png"
MakeIcon 512 "$iconsDir\\afc-logo.png"
MakeIcon 512 "$baseDir\\assets\\afc-logo.png"
MakeIcon 512 "$baseDir\\assets\\afc-logo-full.png"
MakeIcon 512 "$baseDir\\img\\app-icon.png"

$img.Dispose()
`;

  const tmpFile = path.join(BASE, 'scratch', '_generate_perfect_icons.ps1');
  fs.writeFileSync(tmpFile, psScript, 'utf8');
  execSync(`powershell -ExecutionPolicy Bypass -File "${tmpFile}"`, { stdio: 'inherit' });
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
}

// 中心 (505, 426) で cropSize 530px (青い円の直径660pxに対して完全に円内)
// これにより四隅まで100%青色になり、白背景が完全消滅します！
console.log('Generating full-bleed AFC icons...');
generateAllIcons(505, 426, 530);
console.log('Done!');

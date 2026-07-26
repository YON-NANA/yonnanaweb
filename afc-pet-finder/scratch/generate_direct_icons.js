const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const BRAIN = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\3036929b-8083-4c94-874b-98c213ee95e3';
const ROOT  = 'C:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ';
const SUB   = 'C:\\Users\\user\\OneDrive\\Desktop\\動物保護団体ヨンナナ\\afc-pet-finder';

const srcImage = path.join(BRAIN, 'afc_ultra_huge_icon_1785066645300.png');

const dir1 = path.join(ROOT, 'icons');
const dir2 = path.join(SUB, 'icons');

if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });
if (!fs.existsSync(dir2)) fs.mkdirSync(dir2, { recursive: true });

const tmpPs1 = path.join(SUB, 'scratch', '_do_resize.ps1');

const psCode = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("${srcImage.replace(/\\/g, '\\\\')}")

$origW = $img.Width
$origH = $img.Height

$cropRatio = 0.42
$cropW = [int]($origW * $cropRatio)
$cropH = [int]($origH * $cropRatio)
$cropX = [int](($origW - $cropW) / 2)
$cropY = [int](($origH - $cropH) / 2)

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)

function Save-Icon($outPath, $size) {
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outPath"
}

$dirs = @("${dir1.replace(/\\/g, '\\\\')}", "${dir2.replace(/\\/g, '\\\\')}")
$sizes = @(16, 32, 48, 64, 128, 180, 192, 256, 512)

foreach ($d in $dirs) {
    foreach ($s in $sizes) {
        Save-Icon ($d + "\\icon-" + $s + ".png") $s
    }
    Save-Icon ($d + "\\icon-maskable-512.png") 512
    Save-Icon ($d + "\\icon-maskable-192.png") 192
    Save-Icon ($d + "\\afc-logo.png") 512
}

# Save assets / img
Save-Icon "${path.join(ROOT, 'assets', 'afc-logo-full.png').replace(/\\/g, '\\\\')}" 512
Save-Icon "${path.join(SUB, 'assets', 'afc-logo-full.png').replace(/\\/g, '\\\\')}" 512
Save-Icon "${path.join(ROOT, 'img', 'app-icon.png').replace(/\\/g, '\\\\')}" 512
Save-Icon "${path.join(SUB, 'img', 'app-icon.png').replace(/\\/g, '\\\\')}" 512

$img.Dispose()
Write-Host "SUCCESS: ALL ICONS CREATED IN BOTH DIRECTORIES!"
`;

fs.writeFileSync(tmpPs1, psCode, 'utf8');
execSync(`powershell -ExecutionPolicy Bypass -File "${tmpPs1}"`, { stdio: 'inherit' });
if (fs.existsSync(tmpPs1)) fs.unlinkSync(tmpPs1);

console.log('Done generating direct icons!');

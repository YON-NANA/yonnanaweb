Add-Type -AssemblyName System.Drawing

$src = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\afc-logo.png"
$iconsDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\icons"
$assetsDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\assets"
$imgDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\img"

$img = [System.Drawing.Image]::FromFile($src)

# 中心 (505, 426) で cropSize 530px
$cropX = 505 - 265
$cropY = 426 - 265
$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, 530, 530)

$targets = @(
    "$iconsDir\icon-16.png:16",
    "$iconsDir\icon-32.png:32",
    "$iconsDir\icon-48.png:48",
    "$iconsDir\icon-72.png:72",
    "$iconsDir\icon-96.png:96",
    "$iconsDir\icon-128.png:128",
    "$iconsDir\icon-144.png:144",
    "$iconsDir\icon-152.png:152",
    "$iconsDir\icon-180.png:180",
    "$iconsDir\icon-192.png:192",
    "$iconsDir\icon-256.png:256",
    "$iconsDir\icon-384.png:384",
    "$iconsDir\icon-512.png:512",
    "$iconsDir\icon-maskable-192.png:192",
    "$iconsDir\icon-maskable-512.png:512",
    "$iconsDir\afc-logo.png:512",
    "$assetsDir\afc-logo.png:512",
    "$assetsDir\afc-logo-full.png:512",
    "$imgDir\app-icon.png:512"
)

foreach ($item in $targets) {
    $parts = $item.Split(":")
    $path = $parts[0]
    $size = [int]$parts[1]
    
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 79, 139))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)
    $bgBrush.Dispose()
    
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Success: $path ($size x $size)"
}

$img.Dispose()
Write-Host "ALL ICONS GENERATED CLEANLY!"

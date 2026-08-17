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

$list = @(
    [PSCustomObject]@{ Path = "$iconsDir\icon-16.png"; Size = 16 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-32.png"; Size = 32 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-48.png"; Size = 48 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-72.png"; Size = 72 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-96.png"; Size = 96 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-128.png"; Size = 128 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-144.png"; Size = 144 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-152.png"; Size = 152 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-180.png"; Size = 180 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-192.png"; Size = 192 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-256.png"; Size = 256 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-384.png"; Size = 384 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-512.png"; Size = 512 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-maskable-192.png"; Size = 192 },
    [PSCustomObject]@{ Path = "$iconsDir\icon-maskable-512.png"; Size = 512 },
    [PSCustomObject]@{ Path = "$iconsDir\afc-logo.png"; Size = 512 },
    [PSCustomObject]@{ Path = "$assetsDir\afc-logo.png"; Size = 512 },
    [PSCustomObject]@{ Path = "$assetsDir\afc-logo-full.png"; Size = 512 },
    [PSCustomObject]@{ Path = "$imgDir\app-icon.png"; Size = 512 }
)

foreach ($item in $list) {
    $outPath = $item.Path
    $targetSize = $item.Size
    
    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 79, 139))
    $g.FillRectangle($bgBrush, 0, 0, $targetSize, $targetSize)
    $bgBrush.Dispose()
    
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetSize, $targetSize)
    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Success: $outPath ($targetSize x $targetSize)"
}

$img.Dispose()
Write-Host "ALL ICONS GENERATED CLEANLY!"

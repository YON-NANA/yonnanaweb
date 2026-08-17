Add-Type -AssemblyName System.Drawing

$baseDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder"
$srcImage = "$baseDir\afc-logo.png"
$iconsDir = "$baseDir\icons"

$img = [System.Drawing.Image]::FromFile($srcImage)

# 中心 (505, 426) で cropSize 530px (青い円の内部のみを切り抜き)
$cropCenterX = 505
$cropCenterY = 426
$cropSize = 530

$cropX = [int]($cropCenterX - ($cropSize / 2))
$cropY = [int]($cropCenterY - ($cropSize / 2))
$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)

function MakeIcon($sourceImg, $sourceRect, $targetSize, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # 背景を全面青色で塗る (#034F8B)
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 79, 139))
    $g.FillRectangle($bgBrush, 0, 0, $targetSize, $targetSize)
    $bgBrush.Dispose()

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetSize, $targetSize)
    $g.DrawImage($sourceImg, $destRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outPath ($targetSize x $targetSize)"
}

$sizes = @(16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512)
foreach ($s in $sizes) {
    MakeIcon $img $srcRect $s "$iconsDir\icon-$s.png"
}

MakeIcon $img $srcRect 192 "$iconsDir\icon-maskable-192.png"
MakeIcon $img $srcRect 512 "$iconsDir\icon-maskable-512.png"
MakeIcon $img $srcRect 512 "$iconsDir\afc-logo.png"
MakeIcon $img $srcRect 512 "$baseDir\assets\afc-logo.png"
MakeIcon $img $srcRect 512 "$baseDir\assets\afc-logo-full.png"
MakeIcon $img $srcRect 512 "$baseDir\img\app-icon.png"

$img.Dispose()
Write-Host "SUCCESS: All icons generated without errors!"

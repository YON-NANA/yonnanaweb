Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity-ide\brain\732117e8-a9f4-4ec8-8796-74a4c8b5d20a\.user_uploaded\media_1786929758408.png"
$baseDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder"
$iconsDir = "$baseDir\icons"

if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir -Force }

$src = [System.Drawing.Image]::FromFile($srcPath)
$blueColor = [System.Drawing.Color]::FromArgb(255, 3, 72, 131)

$sizes = @(16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512)

# 通常アイコン
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.DrawImage($src, $destRect, 0, 0, $src.Width, $src.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $outPath = "$iconsDir\icon-$size.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved: $outPath"
}

# Maskableアイコン (192, 512)
$maskSizes = @(192, 512)
foreach ($size in $maskSizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $g.Clear($blueColor)

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.DrawImage($src, $destRect, 0, 0, $src.Width, $src.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $outPath = "$iconsDir\icon-maskable-$size.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved Maskable: $outPath"
}

# 主要なロゴファイルもすべて更新
Copy-Item "$iconsDir\icon-512.png" "$iconsDir\afc-logo.png" -Force
Copy-Item "$iconsDir\icon-512.png" "$baseDir\afc-logo.png" -Force
Copy-Item "$iconsDir\icon-512.png" "$baseDir\assets\afc-logo.png" -Force
Copy-Item "$iconsDir\icon-512.png" "$baseDir\assets\afc-logo-full.png" -Force
if (Test-Path "$baseDir\img") {
    Copy-Item "$iconsDir\icon-512.png" "$baseDir\img\app-icon.png" -Force
}
Copy-Item "$iconsDir\icon-32.png" "$baseDir\favicon.ico" -Force

$src.Dispose()
Write-Host "COMPLETE SYNC ALL ICONS!"

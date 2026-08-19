Add-Type -AssemblyName System.Drawing

$src = "C:\Users\user\.gemini\antigravity-ide\brain\732117e8-a9f4-4ec8-8796-74a4c8b5d20a\.user_uploaded\media_1786929758408.png"
$baseDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder"
$iconsDir = "$baseDir\icons"

$sourceImg = [System.Drawing.Image]::FromFile($src)

# 1. 通常アイコン (透明背景のままリサイズ)
function MakeStandardIcon($targetSize, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetSize, $targetSize)
    $g.DrawImage($sourceImg, $destRect, 0, 0, $sourceImg.Width, $sourceImg.Height, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created Standard Icon: $outPath ($targetSize x $targetSize)"
}

# 2. Maskable アイコン (全面青色背景 #034883 にセーフゾーン82%で中央配置)
function MakeMaskableIcon($targetSize, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # 全面をロゴの背景青色 (#034883) で塗りつぶす
    $blue = [System.Drawing.Color]::FromArgb(255, 3, 72, 131)
    $bgBrush = New-Object System.Drawing.SolidBrush($blue)
    $g.FillRectangle($bgBrush, 0, 0, $targetSize, $targetSize)
    $bgBrush.Dispose()

    # セーフゾーン (82%) に収める
    $scale = 0.82
    $drawSize = [int]($targetSize * $scale)
    $offset = [int](($targetSize - $drawSize) / 2)
    
    $destRect = New-Object System.Drawing.Rectangle($offset, $offset, $drawSize, $drawSize)
    $g.DrawImage($sourceImg, $destRect, 0, 0, $sourceImg.Width, $sourceImg.Height, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created Maskable Icon: $outPath ($targetSize x $targetSize)"
}

# 生成する全サイズ
$sizes = @(16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512)
foreach ($s in $sizes) {
    MakeStandardIcon $s "$iconsDir\icon-$s.png"
}

# Maskableアイコン
MakeMaskableIcon 192 "$iconsDir\icon-maskable-192.png"
MakeMaskableIcon 512 "$iconsDir\icon-maskable-512.png"

# その他参照先
MakeStandardIcon 512 "$iconsDir\afc-logo.png"
MakeStandardIcon 512 "$baseDir\afc-logo.png"
MakeStandardIcon 512 "$baseDir\assets\afc-logo.png"
MakeStandardIcon 512 "$baseDir\assets\afc-logo-full.png"
if (Test-Path "$baseDir\img") {
    MakeStandardIcon 512 "$baseDir\img\app-icon.png"
}

# favicon.ico
Copy-Item "$iconsDir\icon-32.png" "$baseDir\favicon.ico" -Force

$sourceImg.Dispose()
Write-Host "ALL ICONS GENERATED WITHOUT ERRORS!"

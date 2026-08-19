Add-Type -AssemblyName System.Drawing

$src = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\afc-logo.png"
$iconsDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\icons"
$assetsDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\assets"
$imgDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder\img"

# バイト配列としてメモリに読み込み、ファイルをロックしない
$bytes = [System.IO.File]::ReadAllBytes($src)
$ms = New-Object System.IO.MemoryStream(,$bytes)
$origBmp = [System.Drawing.Bitmap]::FromStream($ms)

# クロップ領域: 中心 (505, 426) で 530px 正方形
$cropX = 505 - 265
$cropY = 426 - 265
$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, 530, 530)

$destPathsAndSizes = @(
    @{ Path = "$iconsDir\icon-16.png"; Size = 16 },
    @{ Path = "$iconsDir\icon-32.png"; Size = 32 },
    @{ Path = "$iconsDir\icon-48.png"; Size = 48 },
    @{ Path = "$iconsDir\icon-72.png"; Size = 72 },
    @{ Path = "$iconsDir\icon-96.png"; Size = 96 },
    @{ Path = "$iconsDir\icon-128.png"; Size = 128 },
    @{ Path = "$iconsDir\icon-144.png"; Size = 144 },
    @{ Path = "$iconsDir\icon-152.png"; Size = 152 },
    @{ Path = "$iconsDir\icon-180.png"; Size = 180 },
    @{ Path = "$iconsDir\icon-192.png"; Size = 192 },
    @{ Path = "$iconsDir\icon-256.png"; Size = 256 },
    @{ Path = "$iconsDir\icon-384.png"; Size = 384 },
    @{ Path = "$iconsDir\icon-512.png"; Size = 512 },
    @{ Path = "$iconsDir\icon-maskable-192.png"; Size = 192 },
    @{ Path = "$iconsDir\icon-maskable-512.png"; Size = 512 },
    @{ Path = "$iconsDir\afc-logo.png"; Size = 512 },
    @{ Path = "$assetsDir\afc-logo.png"; Size = 512 },
    @{ Path = "$assetsDir\afc-logo-full.png"; Size = 512 },
    @{ Path = "$imgDir\app-icon.png"; Size = 512 }
)

foreach ($item in $destPathsAndSizes) {
    $outPath = $item.Path
    $targetSize = $item.Size

    $bmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # 背景を全面青色（#034F8B）で塗りつぶす
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 79, 139))
    $g.FillRectangle($bgBrush, 0, 0, $targetSize, $targetSize)
    $bgBrush.Dispose()

    # 画像を描画
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetSize, $targetSize)
    $g.DrawImage($origBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()

    # 保存
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated: $outPath ($targetSize x $targetSize)"
}

$origBmp.Dispose()
$ms.Dispose()
Write-Host "PERFECT! All icons generated without errors."

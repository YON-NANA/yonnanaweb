Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "afc-logo.png"
$img = [System.Drawing.Image]::FromFile($srcPath)
$srcBmp = New-Object System.Drawing.Bitmap($img)

# 円の中心とサイズを特定
# 犬猫シルエットとAFC文字の範囲を特定（白に近いピクセル: R>200, G>200, B>200）
$minX = $img.Width; $maxX = 0; $minY = $img.Height; $maxY = 0;
for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $p = $srcBmp.GetPixel($x, $y)
        if ($p.R -gt 220 -and $p.G -gt 220 -and $p.B -gt 220) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$contentW = $maxX - $minX + 1
$contentH = $maxY - $minY + 1
Write-Host "White Content Bounds: X=$minX..$maxX (W=$contentW), Y=$minY..$maxY (H=$contentH)"

# 青い円のバウンディングボックスの中央をクロップ
$circleCX = [int](($minX + $maxX) / 2)
$circleCY = [int](($minY + $maxY) / 2)
Write-Host "Center of Logo Content: ($circleCX, $circleCY)"

# クロップ領域を決定
# Android Maskable Icon の推奨セーフゾーンは中央 80%
# コンテンツ（犬猫+AFC）が中央のセーフゾーン（全体の約65%〜75%）に大きく綺麗に収まるように配置
function GenerateFullBleedIcon($targetSize, $outputPath, $zoomFactor) {
    $outBmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $g = [System.Drawing.Graphics]::FromImage($outBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # 背景を全面ブランドブルー（#034F8B）で塗りつぶす（四隅まで100%青色！）
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 79, 139))
    $g.FillRectangle($bgBrush, 0, 0, $targetSize, $targetSize)
    $bgBrush.Dispose()

    # クロップサイズ（元画像から切り出すサイズ）
    # zoomFactor: 0.65 など（小さいほど大きくズーム）
    $cropSize = [int]($contentW * $zoomFactor)
    $cropX = [int]($circleCX - $cropSize / 2)
    $cropY = [int]($circleCY - $cropSize / 2)

    # 元画像から青い円+白コンテンツをクロップして描画
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetSize, $targetSize)

    $g.DrawImage($srcBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()
    $outBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
    Write-Host "Generated: $outputPath ($targetSize x $targetSize)"
}

# テスト生成（ズーム比率 1.4倍 = cropSize 480px）
GenerateFullBleedIcon 512 "scratch/test_icon_512.png" 1.4

$srcBmp.Dispose()
$img.Dispose()

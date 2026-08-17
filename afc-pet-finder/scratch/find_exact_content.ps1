Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "afc-logo.png"
$img = [System.Drawing.Image]::FromFile($srcPath)
$srcBmp = New-Object System.Drawing.Bitmap($img)

# 中心(512, 469)から青い円の中にある白要素を探索
$cx = 512; $cy = 430
$minX = $img.Width; $maxX = 0; $minY = $img.Height; $maxY = 0;

for ($y = 150; $y -lt 700; $y++) {
    for ($x = 200; $x -lt 800; $x++) {
        $p = $srcBmp.GetPixel($x, $y)
        # 白要素: R>230, G>230, B>230
        if ($p.R -gt 230 -and $p.G -gt 230 -and $p.B -gt 230) {
            # かつ周囲が青色領域の中にあること（白背景の外側ではない）
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$contentW = $maxX - $minX + 1
$contentH = $maxY - $minY + 1
Write-Host "Exact White Content Bounds: X=$minX..$maxX (W=$contentW), Y=$minY..$maxY (H=$contentH)"

# 青い円の正確な中心
$centerCX = [int](($minX + $maxX) / 2)
$centerCY = [int](($minY + $maxY) / 2)
Write-Host "Exact Center: ($centerCX, $centerCY)"

# 四隅のピクセルが青になるクロップサイズ（青い円の直径以内）
# 青い円の直径は約660px。
# cropSize を 620px またはそれ以下にすれば、切り抜いた画像の四隅もすべて青色になります！
$cropSize = 600
$cropX = [int]($centerCX - $cropSize / 2)
$cropY = [int]($centerCY - $cropSize / 2)
Write-Host "Crop Rect: X=$cropX, Y=$cropY, Size=$cropSize"

$srcBmp.Dispose()
$img.Dispose()

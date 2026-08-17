Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile((Resolve-Path "scratch/abc_sample.png"))
$bmp = New-Object System.Drawing.Bitmap($img)

# ABCの白いロゴ部分の領域を計測
$minX = $img.Width; $maxX = 0; $minY = $img.Height; $maxY = 0;
for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 220 -and $p.G -gt 220 -and $p.B -gt 220) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$logoW = $maxX - $minX + 1
$logoH = $maxY - $minY + 1
$ratioW = [math]::Round(($logoW / $img.Width) * 100, 1)
$ratioH = [math]::Round(($logoH / $img.Height) * 100, 1)

Write-Host "ABC Image: $($img.Width) x $($img.Height)"
Write-Host "ABC White Logo: X=$minX..$maxX (W=$logoW), Y=$minY..$maxY (H=$logoH)"
Write-Host "ABC Logo Ratio: Width=$ratioW%, Height=$ratioH%"

$bmp.Dispose()
$img.Dispose()

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "afc-logo.png"))
$bmp = New-Object System.Drawing.Bitmap($img)
Write-Host "Image Size: $($img.Width) x $($img.Height)"
$centerPixel = $bmp.GetPixel([int]($img.Width/2), [int]($img.Height/2))
Write-Host "Center Pixel: [R=$($centerPixel.R), G=$($centerPixel.G), B=$($centerPixel.B), A=$($centerPixel.A)]"

# Check the blue circle diameter
$cy = [int]($img.Height/2)
$leftX = 0; $rightX = $img.Width - 1
for ($x = 0; $x -lt $img.Width; $x++) {
    $p = $bmp.GetPixel($x, $cy)
    if ($p.B -gt 120 -and $p.R -lt 100) { $leftX = $x; break }
}
for ($x = $img.Width - 1; $x -ge 0; $x--) {
    $p = $bmp.GetPixel($x, $cy)
    if ($p.B -gt 120 -and $p.R -lt 100) { $rightX = $x; break }
}

$cx = [int]($img.Width/2)
$topY = 0; $bottomY = $img.Height - 1
for ($y = 0; $y -lt $img.Height; $y++) {
    $p = $bmp.GetPixel($cx, $y)
    if ($p.B -gt 120 -and $p.R -lt 100) { $topY = $y; break }
}
for ($y = $img.Height - 1; $y -ge 0; $y--) {
    $p = $bmp.GetPixel($cx, $y)
    if ($p.B -gt 120 -and $p.R -lt 100) { $bottomY = $y; break }
}

Write-Host "Blue Circle bounds: X=$leftX..$rightX (W=$($rightX-$leftX+1)), Y=$topY..$bottomY (H=$($bottomY-$topY+1))"
Write-Host "Circle ratio in canvas: $([math]::Round(($rightX-$leftX+1)/$img.Width * 100, 1))%"
$bmp.Dispose()
$img.Dispose()

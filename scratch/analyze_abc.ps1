Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "scratch/abc_sample.png"))
$bmp = New-Object System.Drawing.Bitmap($img)
Write-Host "ABC Dimensions:" $img.Width "x" $img.Height
$minX = $img.Width; $maxX = 0; $minY = $img.Height; $maxY = 0;
for ($y = 0; $y -lt $img.Height; $y+=2) {
    for ($x = 0; $x -lt $img.Width; $x+=2) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$w = $maxX - $minX + 1
$h = $maxY - $minY + 1
Write-Host "ABC Non-transparent bounds: X=$minX..$maxX, Y=$minY..$maxY (W=$w, H=$h)"
$bmp.Dispose()
$img.Dispose()

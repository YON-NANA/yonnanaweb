Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "afc-logo.png"))
$bmp = New-Object System.Drawing.Bitmap($img)
Write-Host "AFC Logo Dimensions:" $img.Width "x" $img.Height
$minX = $img.Width; $maxX = 0; $minY = $img.Height; $maxY = 0;
for ($y = 0; $y -lt $img.Height; $y+=5) {
    for ($x = 0; $x -lt $img.Width; $x+=5) {
        $p = $bmp.GetPixel($x, $y)
        # Blue circle detection (not white or transparent)
        if ($p.A -gt 50 -and ($p.R -lt 200 -or $p.G -lt 200 -or $p.B -gt 100)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$w = $maxX - $minX + 1
$h = $maxY - $minY + 1
Write-Host "AFC Blue area bounds: X=$minX..$maxX, Y=$minY..$maxY (W=$w, H=$h)"
$bmp.Dispose()
$img.Dispose()

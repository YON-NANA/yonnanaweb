Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile((Resolve-Path "scratch/abc_sample.png"))
$bmp = New-Object System.Drawing.Bitmap($img)

# 中心付近の白要素（犬猫+文字）
# 四隅が透明で、中央に赤い円が配置されているのか？
$corner = $bmp.GetPixel(10, 10)
$center = $bmp.GetPixel(250, 250)
Write-Host "ABC Corner(10,10): A=$($corner.A), R=$($corner.R), G=$($corner.G), B=$($corner.B)"
Write-Host "ABC Center(250,250): A=$($center.A), R=$($center.R), G=$($center.G), B=$($center.B)"

# 白い文字/イラストの領域を正確に特定
# 赤色は R>150, G<50, B<50
# 白色は R>200, G>200, B>200
$whiteMinX = 500; $whiteMaxX = 0; $whiteMinY = 513; $whiteMaxY = 0
for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -gt 230 -and $p.G -gt 230 -and $p.B -gt 230) {
            if ($x -lt $whiteMinX) { $whiteMinX = $x }
            if ($x -gt $whiteMaxX) { $whiteMaxX = $x }
            if ($y -lt $whiteMinY) { $whiteMinY = $y }
            if ($y -gt $whiteMaxY) { $whiteMaxY = $y }
        }
    }
}
$ww = $whiteMaxX - $whiteMinX + 1
$wh = $whiteMaxY - $whiteMinY + 1
Write-Host "ABC White Icon Elements: X=$whiteMinX..$whiteMaxX (W=$ww), Y=$whiteMinY..$whiteMaxY (H=$wh)"
Write-Host "Ratio relative to canvas: W=$([math]::Round($ww/$img.Width*100,1))%, H=$([math]::Round($wh/$img.Height*100,1))%"

$bmp.Dispose()
$img.Dispose()

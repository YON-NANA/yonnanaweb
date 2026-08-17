Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "afc-logo.png"))
$bmp = New-Object System.Drawing.Bitmap($img)
# Sample blue pixel near (300, 300)
$p = $bmp.GetPixel(300, 300)
Write-Host "Blue Color: Hex=#$($p.R.ToString('X2'))$($p.G.ToString('X2'))$($p.B.ToString('X2')), R=$($p.R), G=$($p.G), B=$($p.B)"
$bmp.Dispose()
$img.Dispose()

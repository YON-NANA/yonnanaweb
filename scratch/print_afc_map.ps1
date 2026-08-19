Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "icons/icon-512.png"))
$bmp = New-Object System.Drawing.Bitmap($img)
Write-Host "AFC icon-512 Width=$($img.Width) Height=$($img.Height)"
for ($y=0; $y -lt $img.Height; $y+=40) {
  $line = ""
  for ($x=0; $x -lt $img.Width; $x+=40) {
    $p = $bmp.GetPixel($x, $y)
    if ($p.R -gt 200 -and $p.G -gt 200 -and $p.B -gt 200) { $line += "W" }
    else { $line += "B" }
  }
  Write-Host $line
}
$bmp.Dispose()
$img.Dispose()

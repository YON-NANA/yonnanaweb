Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "scratch/abc_sample.png"))
$bmp = New-Object System.Drawing.Bitmap($img)
Write-Host "Width=$($img.Width) Height=$($img.Height)"
for ($y=0; $y -lt $img.Height; $y+=40) {
  $line = ""
  for ($x=0; $x -lt $img.Width; $x+=40) {
    $p = $bmp.GetPixel($x, $y)
    if ($p.A -lt 10) { $line += "." }
    elseif ($p.R -gt 200 -and $p.G -gt 200 -and $p.B -gt 200) { $line += "W" }
    else { $line += "R" }
  }
  Write-Host $line
}
$bmp.Dispose()
$img.Dispose()

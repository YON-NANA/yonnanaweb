Add-Type -AssemblyName System.Drawing
function Inspect($name, $path) {
  $fullPath = Resolve-Path $path
  $img = [System.Drawing.Image]::FromFile($fullPath)
  $bmp = New-Object System.Drawing.Bitmap($img)
  $corner = $bmp.GetPixel(0, 0)
  $center = $bmp.GetPixel([int]($img.Width/2), [int]($img.Height/2))
  Write-Host "$name : Size= $($img.Width) x $($img.Height) , Corner=[R=$($corner.R), G=$($corner.G), B=$($corner.B), A=$($corner.A)] Center=[R=$($center.R), G=$($center.G), B=$($center.B), A=$($center.A)]"
  $bmp.Dispose()
  $img.Dispose()
}
Inspect "ABC" "scratch/abc_sample.png"
Inspect "AFC icon-512" "icons/icon-512.png"
Inspect "AFC icon-maskable-512" "icons/icon-maskable-512.png"

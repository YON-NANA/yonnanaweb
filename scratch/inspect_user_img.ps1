Add-Type -AssemblyName System.Drawing

$src = "C:\Users\user\.gemini\antigravity-ide\brain\732117e8-a9f4-4ec8-8796-74a4c8b5d20a\.user_uploaded\media_1786929758408.png"
$img = [System.Drawing.Image]::FromFile($src)
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$bmp = New-Object System.Drawing.Bitmap($img)
Write-Host "Pixel(0,0): $($bmp.GetPixel(0,0))"
Write-Host "Pixel(256,10): $($bmp.GetPixel(256,10))"
Write-Host "Pixel(256,256): $($bmp.GetPixel(256,256))"
$img.Dispose()
$bmp.Dispose()

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "afc-logo.png"))
$bmp = New-Object System.Drawing.Bitmap($img)
# Sample various points in blue area
$pts = @([tuple]::Create(300, 300), [tuple]::Create(200, 400), [tuple]::Create(700, 400), [tuple]::Create(500, 200), [tuple]::Create(500, 700))
foreach ($pt in $pts) {
    $p = $bmp.GetPixel($pt.Item1, $pt.Item2)
    Write-Host "Pt ($($pt.Item1), $($pt.Item2)): Hex=#$($p.R.ToString('X2'))$($p.G.ToString('X2'))$($p.B.ToString('X2'))"
}
$bmp.Dispose()
$img.Dispose()

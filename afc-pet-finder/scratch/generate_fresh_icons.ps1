Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$baseDir = [System.IO.Path]::GetFullPath((Join-Path $scriptDir ".."))

Set-Location $baseDir

$srcLogo = Join-Path $baseDir "afc-logo.png"
if (-not (Test-Path $srcLogo)) {
    $srcLogo = Join-Path $baseDir "icons\afc-logo.png"
}

$iconsDir = Join-Path $baseDir "icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

Write-Host "Base dir: $baseDir"
Write-Host "Source image: $srcLogo"

$srcImg = [System.Drawing.Image]::FromFile($srcLogo)

function Make-PNG {
    param($img, $destPath, $w, $h, $bgHex)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    if ($bgHex) {
        $color = [System.Drawing.ColorTranslator]::FromHtml($bgHex)
        $brush = New-Object System.Drawing.SolidBrush($color)
        $g.FillRectangle($brush, 0, 0, $w, $h)
        $brush.Dispose()
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }

    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated: $destPath"
}

# Standard transparent background icons
$sizes = @(16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512)
foreach ($s in $sizes) {
    Make-PNG $srcImg (Join-Path $iconsDir "icon-$s.png") $s $s $null
}

# Maskable icons (Background #0B5394)
Make-PNG $srcImg (Join-Path $iconsDir "icon-maskable-192.png") 192 192 "#0B5394"
Make-PNG $srcImg (Join-Path $iconsDir "icon-maskable-512.png") 512 512 "#0B5394"

# Also update favicon.ico (256x256 PNG wrapped as ico)
$bmpF = New-Object System.Drawing.Bitmap(256, 256)
$gF   = [System.Drawing.Graphics]::FromImage($bmpF)
$gF.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gF.DrawImage($srcImg, 0, 0, 256, 256)
$gF.Dispose()
$hIcon = $bmpF.GetHicon()
$ico   = [System.Drawing.Icon]::FromHandle($hIcon)
$fStream = [System.IO.File]::Create((Join-Path $baseDir "favicon.ico"))
$ico.Save($fStream)
$fStream.Close()
$ico.Dispose()
$bmpF.Dispose()
Write-Host "Updated: favicon.ico"

$srcImg.Dispose()
Write-Host "All icons generated successfully!"

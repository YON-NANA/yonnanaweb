Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity-ide\brain\3036929b-8083-4c94-874b-98c213ee95e3\afc_new_logo_1785058512286.png"
$srcImg = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Image($destPath, $width, $height) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, $width, $height)
    $g.Dispose()

    if ($destPath.EndsWith(".ico")) {
        $iconHandle = $bmp.GetHicon()
        $icon = [System.Drawing.Icon]::FromHandle($iconHandle)
        $fs = [System.IO.File]::Create($destPath)
        $icon.Save($fs)
        $fs.Close()
        $icon.Dispose()
    } else {
        $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $bmp.Dispose()
    Write-Host "Created: $destPath ($width x $height)"
}

$baseDir = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder"

if (-not (Test-Path "$baseDir\icons")) { New-Item -ItemType Directory -Path "$baseDir\icons" }
if (-not (Test-Path "$baseDir\assets")) { New-Item -ItemType Directory -Path "$baseDir\assets" }
if (-not (Test-Path "$baseDir\img")) { New-Item -ItemType Directory -Path "$baseDir\img" }

Resize-Image "$baseDir\icons\icon-16.png" 16 16
Resize-Image "$baseDir\icons\icon-32.png" 32 32
Resize-Image "$baseDir\icons\icon-180.png" 180 180
Resize-Image "$baseDir\icons\icon-192.png" 192 192
Resize-Image "$baseDir\icons\icon-512.png" 512 512
Resize-Image "$baseDir\icons\afc-logo.png" 512 512
Resize-Image "$baseDir\assets\afc-logo-full.png" 512 512
Resize-Image "$baseDir\img\app-icon.png" 512 512
Resize-Image "$baseDir\favicon.ico" 32 32

$srcImg.Dispose()
Write-Host "All icons generated successfully!"

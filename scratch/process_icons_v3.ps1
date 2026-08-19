Add-Type -AssemblyName System.Drawing

$normalSrc   = "C:\Users\user\.gemini\antigravity-ide\brain\3036929b-8083-4c94-874b-98c213ee95e3\afc_logo_2x_larger_1785064713003.png"
$maskableSrc = "C:\Users\user\.gemini\antigravity-ide\brain\3036929b-8083-4c94-874b-98c213ee95e3\afc_maskable_icon_1785065470885.png"

$baseDir  = "c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder"
$iconsDir = $baseDir + "\icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

function Make-PNG {
    param($srcImg, $destPath, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, $w, $h)
    $g.Dispose()
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "OK: $destPath"
}

$ni = [System.Drawing.Image]::FromFile($normalSrc)
$mi = [System.Drawing.Image]::FromFile($maskableSrc)

# 通常アイコン（any）
foreach ($s in @(16,32,48,64,128,180,192,256,512)) {
    Make-PNG $ni ($iconsDir + "\icon-" + $s + ".png") $s $s
}

# maskable専用（Android ホーム画面用、フチなし全面青）
Make-PNG $mi ($iconsDir + "\icon-maskable-192.png") 192 192
Make-PNG $mi ($iconsDir + "\icon-maskable-512.png") 512 512

Make-PNG $ni ($baseDir + "\assets\afc-logo-full.png") 512 512
Make-PNG $ni ($baseDir + "\img\app-icon.png") 512 512

# favicon.ico
$bmpF = New-Object System.Drawing.Bitmap(256, 256)
$gF   = [System.Drawing.Graphics]::FromImage($bmpF)
$gF.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gF.DrawImage($ni, 0, 0, 256, 256)
$gF.Dispose()
$hIcon = $bmpF.GetHicon()
$ico   = [System.Drawing.Icon]::FromHandle($hIcon)
$fStream = [System.IO.File]::Create($baseDir + "\favicon.ico")
$ico.Save($fStream)
$fStream.Close()
$ico.Dispose()
$bmpF.Dispose()
Write-Host ("OK: " + $baseDir + "\favicon.ico")

$ni.Dispose()
$mi.Dispose()
Write-Host ""
Write-Host "All done!"

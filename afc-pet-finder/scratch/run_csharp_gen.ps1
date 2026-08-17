$src = (Resolve-Path "afc-logo.png").Path
$iconsDir = (Resolve-Path "icons").Path
$assetsDir = (Resolve-Path "assets").Path
$imgDir = (Resolve-Path "img").Path

[IconGenerator]::Generate($src, $iconsDir, $assetsDir, $imgDir)
Write-Host "SUCCESS: All icons generated!"

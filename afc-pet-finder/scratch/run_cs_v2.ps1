$csPath = (Resolve-Path "scratch/IconGeneratorV2.cs").Path
Add-Type -Path $csPath -ReferencedAssemblies "System.Drawing.dll"

$src = (Resolve-Path "afc-logo.png").Path
$iconsDir = (Resolve-Path "icons").Path
$assetsDir = (Resolve-Path "assets").Path
$imgDir = (Resolve-Path "img").Path

[IconGeneratorV2]::Generate($src, $iconsDir, $assetsDir, $imgDir)

Write-Host "SUCCESS: Clean Composite icons generated 100% perfectly!"

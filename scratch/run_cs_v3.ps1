$csPath = (Resolve-Path "scratch/IconGeneratorV3.cs").Path
Add-Type -Path $csPath -ReferencedAssemblies "System.Drawing.dll"

$src = (Resolve-Path "afc-logo.png").Path
$iconsDir = (Resolve-Path "icons").Path
$assetsDir = (Resolve-Path "assets").Path
$imgDir = (Resolve-Path "img").Path

# 比率 0.71 (71%) で生成
[IconGeneratorV3]::Generate($src, $iconsDir, $assetsDir, $imgDir, 0.71)

Write-Host "SUCCESS: 71% Ratio Icons generated perfectly!"

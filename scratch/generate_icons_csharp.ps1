$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class TargetInfo {
    public string Path;
    public int Size;
    public TargetInfo(string p, int s) { Path = p; Size = s; }
}

public class IconGenerator
{
    public static void Generate(string srcPath, string iconsDir, string assetsDir, string imgDir)
    {
        byte[] bytes = File.ReadAllBytes(srcPath);
        using (MemoryStream ms = new MemoryStream(bytes))
        using (Bitmap origBmp = new Bitmap(ms))
        {
            // 中心 (505, 426) で cropSize 530px
            int cropX = 505 - 265;
            int cropY = 426 - 265;
            Rectangle srcRect = new Rectangle(cropX, cropY, 530, 530);

            TargetInfo[] targets = new TargetInfo[]
            {
                new TargetInfo(Path.Combine(iconsDir, "icon-16.png"), 16),
                new TargetInfo(Path.Combine(iconsDir, "icon-32.png"), 32),
                new TargetInfo(Path.Combine(iconsDir, "icon-48.png"), 48),
                new TargetInfo(Path.Combine(iconsDir, "icon-72.png"), 72),
                new TargetInfo(Path.Combine(iconsDir, "icon-96.png"), 96),
                new TargetInfo(Path.Combine(iconsDir, "icon-128.png"), 128),
                new TargetInfo(Path.Combine(iconsDir, "icon-144.png"), 144),
                new TargetInfo(Path.Combine(iconsDir, "icon-152.png"), 152),
                new TargetInfo(Path.Combine(iconsDir, "icon-180.png"), 180),
                new TargetInfo(Path.Combine(iconsDir, "icon-192.png"), 192),
                new TargetInfo(Path.Combine(iconsDir, "icon-256.png"), 256),
                new TargetInfo(Path.Combine(iconsDir, "icon-384.png"), 384),
                new TargetInfo(Path.Combine(iconsDir, "icon-512.png"), 512),
                new TargetInfo(Path.Combine(iconsDir, "icon-maskable-192.png"), 192),
                new TargetInfo(Path.Combine(iconsDir, "icon-maskable-512.png"), 512),
                new TargetInfo(Path.Combine(iconsDir, "afc-logo.png"), 512),
                new TargetInfo(Path.Combine(assetsDir, "afc-logo.png"), 512),
                new TargetInfo(Path.Combine(assetsDir, "afc-logo-full.png"), 512),
                new TargetInfo(Path.Combine(imgDir, "app-icon.png"), 512)
            };

            Color bgColor = Color.FromArgb(255, 3, 79, 139); // #034F8B

            foreach (TargetInfo t in targets)
            {
                using (Bitmap bmp = new Bitmap(t.Size, t.Size))
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                    using (SolidBrush brush = new SolidBrush(bgColor))
                    {
                        g.FillRectangle(brush, 0, 0, t.Size, t.Size);
                    }

                    Rectangle destRect = new Rectangle(0, 0, t.Size, t.Size);
                    g.DrawImage(origBmp, destRect, srcRect, GraphicsUnit.Pixel);

                    bmp.Save(t.Path, ImageFormat.Png);
                    Console.WriteLine("Generated: " + t.Path + " (" + t.Size + "x" + t.Size + ")");
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing.dll"

$src = (Resolve-Path "afc-logo.png").Path
$iconsDir = (Resolve-Path "icons").Path
$assetsDir = (Resolve-Path "assets").Path
$imgDir = (Resolve-Path "img").Path

[IconGenerator]::Generate($src, $iconsDir, $assetsDir, $imgDir)

Write-Host "SUCCESS: All icons generated!"

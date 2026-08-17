$csharpCode = @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class TargetInfoD {
    public string Path;
    public int Size;
    public TargetInfoD(string p, int s) { Path = p; Size = s; }
}

public class IconGeneratorCleanComposite
{
    public static void Generate(string srcPath, string iconsDir, string assetsDir, string imgDir)
    {
        byte[] bytes = File.ReadAllBytes(srcPath);
        using (MemoryStream ms = new MemoryStream(bytes))
        using (Bitmap origBmp = new Bitmap(ms))
        {
            // 元画像から白いロゴ要素（犬猫+AFC文字）の正確な境界を取得
            int minX = origBmp.Width, maxX = 0, minY = origBmp.Height, maxY = 0;
            for (int y = 100; y < 800; y++)
            {
                for (int x = 150; x < 850; x++)
                {
                    Color p = origBmp.GetPixel(x, y);
                    // 白要素の判定 (R>220, G>220, B>220)
                    if (p.R > 220 && p.G > 220 && p.B > 220)
                    {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            int logoW = maxX - minX + 1;
            int logoH = maxY - minY + 1;
            Rectangle logoSrcRect = new Rectangle(minX, minY, logoW, logoH);

            TargetInfoD[] targets = new TargetInfoD[]
            {
                new TargetInfoD(Path.Combine(iconsDir, "icon-16.png"), 16),
                new TargetInfoD(Path.Combine(iconsDir, "icon-32.png"), 32),
                new TargetInfoD(Path.Combine(iconsDir, "icon-48.png"), 48),
                new TargetInfoD(Path.Combine(iconsDir, "icon-72.png"), 72),
                new TargetInfoD(Path.Combine(iconsDir, "icon-96.png"), 96),
                new TargetInfoD(Path.Combine(iconsDir, "icon-128.png"), 128),
                new TargetInfoD(Path.Combine(iconsDir, "icon-144.png"), 144),
                new TargetInfoD(Path.Combine(iconsDir, "icon-152.png"), 152),
                new TargetInfoD(Path.Combine(iconsDir, "icon-180.png"), 180),
                new TargetInfoD(Path.Combine(iconsDir, "icon-192.png"), 192),
                new TargetInfoD(Path.Combine(iconsDir, "icon-256.png"), 256),
                new TargetInfoD(Path.Combine(iconsDir, "icon-384.png"), 384),
                new TargetInfoD(Path.Combine(iconsDir, "icon-512.png"), 512),
                new TargetInfoD(Path.Combine(iconsDir, "icon-maskable-192.png"), 192),
                new TargetInfoD(Path.Combine(iconsDir, "icon-maskable-512.png"), 512),
                new TargetInfoD(Path.Combine(iconsDir, "afc-logo.png"), 512),
                new TargetInfoD(Path.Combine(assetsDir, "afc-logo.png"), 512),
                new TargetInfoD(Path.Combine(assetsDir, "afc-logo-full.png"), 512),
                new TargetInfoD(Path.Combine(imgDir, "app-icon.png"), 512)
            };

            // AFCのブランドブルー (#034F8B)
            Color bgColor = Color.FromArgb(255, 3, 79, 139);

            foreach (TargetInfoD t in targets)
            {
                using (Bitmap bmp = new Bitmap(t.Size, t.Size))
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                    // 1. 背景を全面青色で塗りつぶす（四隅まで100%青色！）
                    using (SolidBrush brush = new SolidBrush(bgColor))
                    {
                        g.FillRectangle(brush, 0, 0, t.Size, t.Size);
                    }

                    // 2. 白いロゴを、全体の約56%のサイズ（ABCアイコンと寸分違わぬ完璧な黄金比率）で中央に配置！
                    double scale = (t.Size * 0.56) / Math.Max(logoW, logoH);
                    int destW = (int)(logoW * scale);
                    int destH = (int)(logoH * scale);
                    int destX = (t.Size - destW) / 2;
                    int destY = (t.Size - destH) / 2;

                    Rectangle destRect = new Rectangle(destX, destY, destW, destH);
                    g.DrawImage(origBmp, destRect, logoSrcRect, GraphicsUnit.Pixel);

                    bmp.Save(t.Path, ImageFormat.Png);
                    Console.WriteLine("Generated: " + t.Path + " (" + t.Size + "x" + t.Size + ")");
                }
            }
        }
    }
}
'@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing.dll"

$src = (Resolve-Path "afc-logo.png").Path
$iconsDir = (Resolve-Path "icons").Path
$assetsDir = (Resolve-Path "assets").Path
$imgDir = (Resolve-Path "img").Path

[IconGeneratorCleanComposite]::Generate($src, $iconsDir, $assetsDir, $imgDir)

Write-Host "SUCCESS: Clean Composite icons generated!"

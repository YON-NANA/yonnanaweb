using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class TargetSpec {
    public string Path;
    public int Size;
    public TargetSpec(string p, int s) { Path = p; Size = s; }
}

public class IconGeneratorV2
{
    public static void Generate(string srcPath, string iconsDir, string assetsDir, string imgDir)
    {
        byte[] bytes = File.ReadAllBytes(srcPath);
        using (MemoryStream ms = new MemoryStream(bytes))
        using (Bitmap origBmp = new Bitmap(ms))
        {
            // 1. 白いロゴ（犬猫シルエット＋AFC文字）の範囲を検出
            int minX = origBmp.Width;
            int maxX = 0;
            int minY = origBmp.Height;
            int maxY = 0;

            for (int y = 150; y < 750; y++)
            {
                for (int x = 150; x < 850; x++)
                {
                    Color p = origBmp.GetPixel(x, y);
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

            TargetSpec[] targets = new TargetSpec[]
            {
                new TargetSpec(Path.Combine(iconsDir, "icon-16.png"), 16),
                new TargetSpec(Path.Combine(iconsDir, "icon-32.png"), 32),
                new TargetSpec(Path.Combine(iconsDir, "icon-48.png"), 48),
                new TargetSpec(Path.Combine(iconsDir, "icon-72.png"), 72),
                new TargetSpec(Path.Combine(iconsDir, "icon-96.png"), 96),
                new TargetSpec(Path.Combine(iconsDir, "icon-128.png"), 128),
                new TargetSpec(Path.Combine(iconsDir, "icon-144.png"), 144),
                new TargetSpec(Path.Combine(iconsDir, "icon-152.png"), 152),
                new TargetSpec(Path.Combine(iconsDir, "icon-180.png"), 180),
                new TargetSpec(Path.Combine(iconsDir, "icon-192.png"), 192),
                new TargetSpec(Path.Combine(iconsDir, "icon-256.png"), 256),
                new TargetSpec(Path.Combine(iconsDir, "icon-384.png"), 384),
                new TargetSpec(Path.Combine(iconsDir, "icon-512.png"), 512),
                new TargetSpec(Path.Combine(iconsDir, "icon-maskable-192.png"), 192),
                new TargetSpec(Path.Combine(iconsDir, "icon-maskable-512.png"), 512),
                new TargetSpec(Path.Combine(iconsDir, "afc-logo.png"), 512),
                new TargetSpec(Path.Combine(assetsDir, "afc-logo.png"), 512),
                new TargetSpec(Path.Combine(assetsDir, "afc-logo-full.png"), 512),
                new TargetSpec(Path.Combine(imgDir, "app-icon.png"), 512)
            };

            // 全面青色 (#034F8B)
            Color bgColor = Color.FromArgb(255, 3, 79, 139);

            foreach (TargetSpec t in targets)
            {
                using (Bitmap bmp = new Bitmap(t.Size, t.Size))
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                    // 背景を全面青色で塗りつぶす（四隅まで100%青色！）
                    using (SolidBrush brush = new SolidBrush(bgColor))
                    {
                        g.FillRectangle(brush, 0, 0, t.Size, t.Size);
                    }

                    // 白いロゴを、全体の約56%のサイズ（ABCアイコンと寸分違わぬ完璧な黄金比率）で中央に配置！
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

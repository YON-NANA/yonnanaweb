using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class IconGenerator
{
    public static void Run()
    {
        string srcPath = @"C:\Users\user\.gemini\antigravity-ide\brain\732117e8-a9f4-4ec8-8796-74a4c8b5d20a\.user_uploaded\media_1786929758408.png";
        string baseDir = @"c:\Users\user\OneDrive\Desktop\動物保護団体ヨンナナ\afc-pet-finder";
        string iconsDir = Path.Combine(baseDir, "icons");

        Directory.CreateDirectory(iconsDir);

        using (Image src = Image.FromFile(srcPath))
        {
            Color blueBg = Color.FromArgb(255, 3, 72, 131); // #034883

            int[] sizes = new int[] { 16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512 };

            // 1. Standard transparent icons
            foreach (int size in sizes)
            {
                using (Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb))
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.Clear(Color.Transparent);

                    g.DrawImage(src, new Rectangle(0, 0, size, size), 0, 0, src.Width, src.Height, GraphicsUnit.Pixel);
                    bmp.Save(Path.Combine(iconsDir, "icon-" + size + ".png"), ImageFormat.Png);
                }
            }

            // 2. Maskable icons (全面青色背景 #034883 の上に、円形ロゴを拡大配置して余白なくフィット)
            int[] maskableSizes = new int[] { 192, 512 };
            foreach (int size in maskableSizes)
            {
                using (Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb))
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    
                    // 全面青色背景
                    using (SolidBrush brush = new SolidBrush(blueBg))
                    {
                        g.FillRectangle(brush, 0, 0, size, size);
                    }

                    // ロゴを全体に描画
                    g.DrawImage(src, new Rectangle(0, 0, size, size), 0, 0, src.Width, src.Height, GraphicsUnit.Pixel);
                    bmp.Save(Path.Combine(iconsDir, "icon-maskable-" + size + ".png"), ImageFormat.Png);
                    Console.WriteLine("Generated maskable: icon-maskable-" + size + ".png");
                }
            }

            // 3. Main logo copies
            using (Bitmap bmp = new Bitmap(512, 512, PixelFormat.Format32bppArgb))
            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.Clear(Color.Transparent);
                g.DrawImage(src, new Rectangle(0, 0, 512, 512), 0, 0, src.Width, src.Height, GraphicsUnit.Pixel);

                bmp.Save(Path.Combine(iconsDir, "afc-logo.png"), ImageFormat.Png);
                bmp.Save(Path.Combine(baseDir, "afc-logo.png"), ImageFormat.Png);
                
                string assetsDir = Path.Combine(baseDir, "assets");
                Directory.CreateDirectory(assetsDir);
                bmp.Save(Path.Combine(assetsDir, "afc-logo.png"), ImageFormat.Png);
                bmp.Save(Path.Combine(assetsDir, "afc-logo-full.png"), ImageFormat.Png);

                string imgDir = Path.Combine(baseDir, "img");
                if (Directory.Exists(imgDir))
                {
                    bmp.Save(Path.Combine(imgDir, "app-icon.png"), ImageFormat.Png);
                }
            }

            // 4. Favicon
            File.Copy(Path.Combine(iconsDir, "icon-32.png"), Path.Combine(baseDir, "favicon.ico"), true);
            Console.WriteLine("Copied favicon.ico");
        }

        Console.WriteLine("ALL ICONS CREATED PERFECTLY!");
    }
}

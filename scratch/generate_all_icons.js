const { Jimp } = require("jimp");
const path = require("path");
const fs = require("fs");

async function generateAllIcons() {
  try {
    const logoPath = path.join(__dirname, "../icons/afc-logo.png");
    if (!fs.existsSync(logoPath)) {
      console.error("afc-logo.png not found!");
      return;
    }

    const image = await Jimp.read(logoPath);
    
    // 生成するサイズリスト
    const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

    for (const size of sizes) {
      // ダークテーマ背景 (#080F1A) にロゴを中央配置
      const bg = new Jimp({ width: size, height: size, color: '#080F1A' });
      
      // ロゴのスケール比率 (80%サイズで収める)
      const targetLogoSize = Math.round(size * 0.8);
      const logoScaled = image.clone().scaleToFit({ w: targetLogoSize, h: targetLogoSize });
      
      const x = Math.round((size - logoScaled.bitmap.width) / 2);
      const y = Math.round((size - logoScaled.bitmap.height) / 2);
      
      bg.composite(logoScaled, x, y);
      
      const outPath = path.join(__dirname, `../icons/icon-${size}.png`);
      await bg.write(outPath);
      console.log(`Generated: icon-${size}.png (${size}x${size})`);
    }

    // favicon.ico 用に 32x32 の PNG を root の favicon.ico / favicon.png としてもコピー
    const favicon32Path = path.join(__dirname, "../icons/icon-32.png");
    const faviconDest = path.join(__dirname, "../favicon.ico");
    fs.copyFileSync(favicon32Path, faviconDest);
    console.log("Copied icon-32.png to favicon.ico");

  } catch (err) {
    console.error("Error generating icons:", err);
  }
}

generateAllIcons();

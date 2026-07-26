const { Jimp } = require("jimp");

async function resizeIcons() {
  try {
    // afc-logo.pngを読み込む
    const image = await Jimp.read("../icons/afc-logo.png");
    
    // 正方形にするため、カバーかcontainにする。
    // 背景を暗い色（テーマカラーの#080F1A）で塗りつぶし、中央に配置するのが安全
    // jimp v1 API
    
    const size = 512;
    const bg = new Jimp({width: size, height: size, color: '#080F1A'});
    
    // ロゴをリサイズ (400x400くらいに縮小)
    const logo512 = image.clone().scaleToFit({w: 400, h: 400});
    const x = (size - logo512.bitmap.width) / 2;
    const y = (size - logo512.bitmap.height) / 2;
    bg.composite(logo512, x, y);
    await bg.write("../icons/icon-512.png");
    
    const bg192 = new Jimp({width: 192, height: 192, color: '#080F1A'});
    const logo192 = image.clone().scaleToFit({w: 150, h: 150});
    bg192.composite(logo192, (192 - logo192.bitmap.width) / 2, (192 - logo192.bitmap.height) / 2);
    await bg192.write("../icons/icon-192.png");
    
    console.log("Icons generated successfully.");
  } catch(e) {
    console.error("Error generating icons:", e);
  }
}

resizeIcons();

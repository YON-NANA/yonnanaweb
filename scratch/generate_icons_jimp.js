const { Jimp } = require("jimp");
const path = require("path");
const fs = require("fs");

const srcPath = "C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\732117e8-a9f4-4ec8-8796-74a4c8b5d20a\\.user_uploaded\\media_1786929758408.png";
const projectDir = path.resolve(__dirname, "..");
const iconsDir = path.join(projectDir, "icons");

async function main() {
  console.log("Loading source image:", srcPath);
  if (!fs.existsSync(srcPath)) {
    throw new Error("Source image not found: " + srcPath);
  }

  const srcImage = await Jimp.read(srcPath);
  console.log(`Source image loaded: ${srcImage.bitmap.width}x${srcImage.bitmap.height}`);

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512];

  // 1. Standard transparent icons
  for (const size of sizes) {
    const resized = srcImage.clone().resize({ w: size, h: size });
    const outPath = path.join(iconsDir, `icon-${size}.png`);
    await resized.write(outPath);
    console.log(`Wrote: icon-${size}.png`);
  }

  // 2. Maskable icons
  const maskSizes = [192, 512];
  for (const size of maskSizes) {
    // 全面青色背景 (#034883)
    const bg = new Jimp({ width: size, height: size, color: 0x034883ff });
    const resized = srcImage.clone().resize({ w: size, h: size });
    bg.composite(resized, 0, 0);
    const outPath = path.join(iconsDir, `icon-maskable-${size}.png`);
    await bg.write(outPath);
    console.log(`Wrote: icon-maskable-${size}.png`);
  }

  // 3. afc-logo.png & assets
  const logo512 = srcImage.clone().resize({ w: 512, h: 512 });
  await logo512.write(path.join(iconsDir, "afc-logo.png"));
  await logo512.write(path.join(projectDir, "afc-logo.png"));

  const assetsDir = path.join(projectDir, "assets");
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  await logo512.write(path.join(assetsDir, "afc-logo.png"));
  await logo512.write(path.join(assetsDir, "afc-logo-full.png"));

  const imgDir = path.join(projectDir, "img");
  if (fs.existsSync(imgDir)) {
    await logo512.write(path.join(imgDir, "app-icon.png"));
  }

  // 4. favicon.ico (copy from icon-32.png)
  fs.copyFileSync(path.join(iconsDir, "icon-32.png"), path.join(projectDir, "favicon.ico"));
  console.log("Wrote favicon.ico");

  console.log("=== ALL ICONS GENERATED & SYNCED SUCCESSFULLY! ===");
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});

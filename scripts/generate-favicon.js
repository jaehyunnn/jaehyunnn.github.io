const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  const svgPath = path.join(__dirname, '../public/favicon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate PNG files at different sizes
  const sizes = [16, 32, 48, 64, 128, 256];

  console.log('Generating favicon PNG files...');

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../public/favicon-${size}x${size}.png`));
    console.log(`✓ Generated favicon-${size}x${size}.png`);
  }

  // Generate the main favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(path.join(__dirname, '../public/favicon.ico'));
  console.log('✓ Generated favicon.ico');

  // Generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png');

  // Generate android-chrome icons
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../public/android-chrome-192x192.png'));
  console.log('✓ Generated android-chrome-192x192.png');

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/android-chrome-512x512.png'));
  console.log('✓ Generated android-chrome-512x512.png');

  console.log('\n✨ All favicon files generated successfully!');
}

generateFavicon().catch(console.error);

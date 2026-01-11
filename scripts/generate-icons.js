/**
 * Icon Generation Script
 *
 * This script generates PNG icons from SVG files for PWA support.
 * Run this script before building for production if you need PNG icons.
 *
 * Requirements:
 * - Node.js 18+
 * - sharp package (npm install sharp --save-dev)
 *
 * Usage:
 * node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Note: sharp not installed. Using SVG icons directly.');
  console.log('For PNG icons, run: npm install sharp --save-dev');

  // Create simple redirect files
  const publicDir = path.join(__dirname, '..', 'public');

  // Create a simple HTML that redirects icon requests
  const sizes = [192, 512];

  sizes.forEach((size) => {
    const svgPath = path.join(publicDir, `icon-${size}.svg`);
    const pngPath = path.join(publicDir, `icon-${size}.png`);

    if (fs.existsSync(svgPath) && !fs.existsSync(pngPath)) {
      // Copy SVG content to a temporary PNG placeholder
      // In production, you'd generate actual PNGs
      console.log(`SVG icon available at: icon-${size}.svg`);
    }
  });

  process.exit(0);
}

// Generate PNG icons from SVG
async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  const sizes = [192, 512];

  for (const size of sizes) {
    const svgPath = path.join(publicDir, `icon-${size}.svg`);
    const pngPath = path.join(publicDir, `icon-${size}.png`);

    if (fs.existsSync(svgPath)) {
      console.log(`Generating ${size}x${size} PNG...`);

      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);

      console.log(`Created: icon-${size}.png`);
    }
  }

  // Generate favicon
  const svg192 = path.join(publicDir, 'icon-192.svg');
  const faviconPath = path.join(publicDir, 'favicon.ico');

  if (fs.existsSync(svg192)) {
    console.log('Generating favicon...');

    await sharp(svg192)
      .resize(32, 32)
      .toFile(faviconPath.replace('.ico', '.png'));

    console.log('Created: favicon.png (rename to favicon.ico if needed)');
  }

  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);

const sharp = require('sharp');
const fs = require('fs');

async function optimize() {
  const input = 'public/logo.png';
  const output = 'public/logo_optimized.png';
  const webpOutput = 'public/logo.webp';
  
  // Resize to max 600px width and save as high compression PNG
  await sharp(input)
    .resize({ width: 600, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 80 })
    .toFile(output);
    
  // Also create a WebP version
  await sharp(input)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(webpOutput);

  console.log('Optimized PNG size:', fs.statSync(output).size);
  console.log('Optimized WebP size:', fs.statSync(webpOutput).size);
  
  // Overwrite the original with the optimized PNG
  fs.renameSync(output, input);
}

optimize().catch(console.error);

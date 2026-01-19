const sharp = require('sharp');
const path = require('path');

async function smoothSkin() {
    const inputPath = path.join(__dirname, 'founder-award.jpg.jpg');
    const outputPath = path.join(__dirname, 'founder-award-smoothed.jpg');

    console.log('Starting subtle skin smoothing...');

    try {
        // Get image metadata
        const metadata = await sharp(inputPath).metadata();
        console.log(`Image size: ${metadata.width}x${metadata.height}`);

        // Subtle skin smoothing - very light touch
        await sharp(inputPath)
            .blur(0.8) // Very subtle blur - just softens skin slightly
            .modulate({
                brightness: 1.02, // Tiny brightness lift
                saturation: 1.01  // Keep colors natural
            })
            .sharpen({ // Preserve details like eyes, smile, clothing
                sigma: 0.8,
                m1: 0.3,
                m2: 0.2
            })
            .gamma(1.02) // Very slight shadow lift
            .toFile(outputPath);

        console.log('Subtly smoothed image created: founder-award-smoothed.jpg');
        console.log('\nDone! Natural look with subtle skin refinement.');

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

smoothSkin();

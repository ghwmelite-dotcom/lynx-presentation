const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF(htmlFile, outputFile) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport for high quality
    await page.setViewport({
        width: 1200,
        height: 900,
        deviceScaleFactor: 2 // High DPI for crisp output
    });

    const filePath = path.resolve(__dirname, htmlFile);
    await page.goto(`file://${filePath}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Extra time for rendering

    await page.pdf({
        path: outputFile,
        format: 'A5',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        scale: 1
    });

    console.log(`Generated: ${outputFile}`);
    await browser.close();
}

async function main() {
    try {
        console.log('Generating high-quality PDFs...\n');

        await generatePDF('leave-behind-card-ghana.html', 'leave-behind-card-ghana.pdf');
        await generatePDF('leave-behind-card-white.html', 'leave-behind-card-white.pdf');

        console.log('\nAll PDFs generated successfully!');
    } catch (error) {
        console.error('Error generating PDFs:', error);
        process.exit(1);
    }
}

main();

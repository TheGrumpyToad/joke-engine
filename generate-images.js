const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateSocialImages() {
  console.log('🚀 Starting social image generation...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to social media image size
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2
  });
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, 'public', 'og-image.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  await page.setContent(htmlContent);
  
  // Wait for fonts and images to load
  await page.waitForTimeout(2000);
  
  // Generate og-image.jpg
  const ogImagePath = path.join(__dirname, 'public', 'og-image.jpg');
  await page.screenshot({
    path: ogImagePath,
    type: 'jpeg',
    quality: 90,
    fullPage: false
  });
  
  console.log('✅ Generated og-image.jpg');
  
  // Generate twitter-image.jpg (same as og-image for now)
  const twitterImagePath = path.join(__dirname, 'public', 'twitter-image.jpg');
  await page.screenshot({
    path: twitterImagePath,
    type: 'jpeg',
    quality: 90,
    fullPage: false
  });
  
  console.log('✅ Generated twitter-image.jpg');
  
  await browser.close();
  console.log('🎉 Social images generated successfully!');
}

// Check if puppeteer is available
try {
  generateSocialImages().catch(console.error);
} catch (error) {
  console.log('📝 Manual instructions for creating social images:');
  console.log('');
  console.log('1. Install Puppeteer:');
  console.log('   npm install puppeteer');
  console.log('');
  console.log('2. Run the generator:');
  console.log('   node generate-images.js');
  console.log('');
  console.log('3. Or manually create images:');
  console.log('   - Open public/og-image.html in Chrome');
  console.log('   - Take a screenshot at 1200x630px');
  console.log('   - Save as og-image.jpg and twitter-image.jpg');
  console.log('');
  console.log('Alternative: Use online tools like:');
  console.log('- Canva.com');
  console.log('- Figma.com');
  console.log('- Adobe Express');
}

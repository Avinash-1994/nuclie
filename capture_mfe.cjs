const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Create artifacts dir if it doesn't exist
  const artifactsDir = '/home/avinash/.gemini/antigravity/brain/2a1b9a80-90e1-4192-bb49-2bd75e779303';
  if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
  
  await page.screenshot({ path: artifactsDir + '/mfe_real_world_demo.png' });
  await browser.close();
  console.log('Capture completed successfully!');
})();

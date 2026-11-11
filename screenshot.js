const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Log browser console errors
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log("Navigating to localhost:3000...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log("Clicking Employee Directory tab...");
  await page.click('[data-target="employee-directory-view"]');
  
  // Wait for the grid to populate (wait for loading text to disappear)
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Taking screenshot...");
  await page.screenshot({ path: '/Users/s.premkumar/.gemini/antigravity/brain/980f1b4f-05aa-44ee-9ccb-1d9aea12028c/scratch/directory_screenshot.png' });
  
  console.log("Extracting HTML...");
  const gridHtml = await page.$eval('#employee-grid', el => el.innerHTML).catch(e => e.message);
  console.log("GRID HTML: ", gridHtml);
  
  await browser.close();
})();

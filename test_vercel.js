const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('https://billing-software-amber-chi.vercel.app/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'vercel_screenshot.png' });
  
  await browser.close();
  console.log("Screenshot saved!");
})();

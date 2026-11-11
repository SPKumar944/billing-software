const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const targetStr = `<!-- ID Card Permanent Display -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center;">`;

const repStr = `<!-- ID Card & Pay History Row -->
          <div style="display: flex; gap: 24px; align-items: flex-start; width: 100%;">
          <!-- ID Card Permanent Display -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; width: max-content;">`;

html = html.replace(targetStr, repStr);
fs.writeFileSync('public/index.html', html);
console.log("Wrapped!");

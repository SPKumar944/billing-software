const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Revert the inner ID card size back to normal
html = html.replace('width: 180px; background: #fff;', 'width: 250px; background: #fff;');
html = html.replace('width: 70px; height: 70px; margin: 0 auto 12px auto;', 'width: 110px; height: 110px; margin: 0 auto 16px auto;');
html = html.replace('font-size:14px;', 'font-size:18px;'); // Name
html = html.replace('font-size:10px;', 'font-size:13px;'); // Role
html = html.replace('font-size:9px;', 'font-size:11px;'); // Department & Labels
html = html.replace('width:40px; height:40px; display:block; margin:0 auto;', 'width:70px; height:70px; display:block; margin:0 auto;'); // QR code
html = html.replace('<h2 style="margin-top:0; margin-bottom:12px; font-size:14px; align-self:flex-start;">ID Card</h2>', '<h2 style="margin-top:0; margin-bottom:16px; font-size:18px; align-self:flex-start;">ID Card</h2>');

// 2. Wrap ID Card and Pay History in a flex row so ID card section shrinks
const idCardStart = `<!-- ID Card Permanent Display -->
          <div style="background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center;">`;

const idCardWrap = `<!-- ID Card & Pay History Row -->
          <div style="display: flex; gap: 24px; align-items: flex-start; width: 100%;">
          
          <!-- ID Card Permanent Display -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; width: max-content;">`;

html = html.replace(idCardStart, idCardWrap);

// And close the flex row after Pay History
const payHistoryEnd = `              </tbody>
            </table>
          </div>`;
          
const payHistoryWrapEnd = `              </tbody>
            </table>
          </div>
          </div> <!-- End ID Card & Pay History Row -->`;

html = html.replace(payHistoryEnd, payHistoryWrapEnd);

// Also add flex: 1 to Pay History so it takes the remaining width in that row
html = html.replace('<!-- Pay History -->\n          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">', '<!-- Pay History -->\n          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); flex: 1;">');

// 3. Fix Calendar Grid container to not stretch massively
const calStart = `<div id="attendance-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center;">`;
const calFix = `<div id="attendance-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 40px); gap: 8px; text-align: center; justify-content: flex-start;">`;
html = html.replace(calStart, calFix);

fs.writeFileSync('public/index.html', html);

// 4. Update script.js to make calendar boxes fixed size instead of aspect-ratio 1
let script = fs.readFileSync('public/script.js', 'utf8');

const scriptAspect = `    const dayBox = document.createElement('div');
    dayBox.style.aspectRatio = '1';
    dayBox.style.borderRadius = '8px';`;
const scriptAspectFix = `    const dayBox = document.createElement('div');
    dayBox.style.width = '40px';
    dayBox.style.height = '40px';
    dayBox.style.borderRadius = '8px';`;
script = script.replace(scriptAspect, scriptAspectFix);

fs.writeFileSync('public/script.js', script);
console.log("Patched sizings!");

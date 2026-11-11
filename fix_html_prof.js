const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const profMatch = html.match(/<!-- VIEW 7: EMPLOYEE PROFILE -->[\s\S]*?(?=<!-- ID Card Modal -->)/);
if (profMatch) {
  const profHtml = profMatch[0];
  html = html.replace(profHtml, '');
  
  // Inject it right after employee-directory-view
  const dirEndStr = '        <div id="employee-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; padding: 24px 0;">\n          <p style="color:#888;">Loading employees...</p>\n        </div>\n      </div>';
  
  html = html.replace(dirEndStr, dirEndStr + "\n\n" + profHtml);
  
  fs.writeFileSync('public/index.html', html);
  console.log("Moved profile view!");
}

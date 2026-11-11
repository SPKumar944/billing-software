const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// I will just find the `<!-- VIEW 5: EMPLOYEE ONBOARDING -->` and move it up.
let parts = html.split('<!-- VIEW 5: EMPLOYEE ONBOARDING -->');
let mainPart = parts[0];
let view5 = '<!-- VIEW 5: EMPLOYEE ONBOARDING -->' + parts[1];

// Remove the two closing divs from mainPart
mainPart = mainPart.replace(/    <\/div>\s*  <\/div>\s*$/, "");

// Append view5, and then put the two closing divs back
html = mainPart + view5.replace(/<!-- Full Page Add Item Modal/, "    </div>\n  </div>\n\n  <!-- Full Page Add Item Modal");

fs.writeFileSync('public/index.html', html);

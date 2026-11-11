const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const view5Start = html.indexOf('<!-- VIEW 5: EMPLOYEE ONBOARDING -->');
const scriptStart = html.indexOf('<script src="script.js');

let view5Str = html.substring(view5Start, scriptStart);

// It has 4 extra closing divs we need to trim, wait, let's just extract the inner form.
let innerView = view5Str.replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/, ""); // remove trailing closing divs

// Now remove view5 from the file
html = html.substring(0, view5Start) + "  </div>\n</div>\n\n<script src=\"script.js?v=999\"></script>\n</body>\n</html>";

// Now insert innerView right before `    </div>\n  </div>\n\n  <!-- Full Page Add Item Modal`
const insertPoint = html.indexOf('<!-- Full Page Add Item Modal');
html = html.substring(0, insertPoint) + innerView + '\n\n  ' + html.substring(insertPoint);

fs.writeFileSync('public/index.html', html);

const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// The file currently ends with:
// </div>
// </div>
// <script src="script.js?v=1003"></script>

// Replace the two ending divs with just ONE
html = html.replace(/<\/div>\n  <\/div>\n  <script src="script.js\?v=1003"><\/script>/, "</div>\n  <script src=\"script.js?v=1004\"></script>");

fs.writeFileSync('public/index.html', html);
console.log("Fixed ending divs!");

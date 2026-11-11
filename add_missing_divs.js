const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// The file currently ends with:
//   </div>
//   <!-- End ID Card Modal -->
//   <script src="script.js?v=1002"></script>
// </body>
// </html>

// We need to add TWO closing divs before the script tag.
html = html.replace(/<script src="script.js\?v=1002"><\/script>/, "</div>\n  </div>\n  <script src=\"script.js?v=1003\"></script>");

fs.writeFileSync('public/index.html', html);
console.log("Added missing divs!");

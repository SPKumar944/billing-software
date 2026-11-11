const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const start = html.indexOf('<div id="employee-onboarding-view"');
const endStr = '<button type="submit" class="btn btn-primary" id="btn-submit-employee">Save Employee Record</button>\n            </div>\n          </form>\n        </div>\n      </div>';
const end = html.indexOf(endStr) + endStr.length;
const block = html.substring(start, end);

let depth = 0;
let lines = block.split('\n');
for (let i=0; i<lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/<div\b/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  depth += (opens - closes);
  console.log(`${i+1}: ${depth} - ${line.trim()}`);
}

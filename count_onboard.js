const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const start = html.indexOf('<div id="employee-onboarding-view"');
const endStr = '<button type="submit" class="btn btn-primary" id="btn-submit-employee">Save Employee Record</button>\n            </div>\n          </form>\n        </div>\n      </div>';
const end = html.indexOf(endStr) + endStr.length;

const block = html.substring(start, end);
const opens = (block.match(/<div\b/g) || []).length;
const closes = (block.match(/<\/div>/g) || []).length;

console.log("Onboarding Opens:", opens);
console.log("Onboarding Closes:", closes);


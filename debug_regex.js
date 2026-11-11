const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
const onboardEndMatch = html.match(/<button type="submit" class="btn btn-primary" id="btn-submit-employee">Save Employee Record<\/button>\s*<\/div>\s*<\/form>\s*<\/div>\s*<\/div>/);
console.log("Matched text length:", onboardEndMatch ? onboardEndMatch[0].length : 0);
console.log("Matched text:", onboardEndMatch ? onboardEndMatch[0] : null);

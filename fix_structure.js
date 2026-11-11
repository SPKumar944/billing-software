const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const idCardStart = html.indexOf('<!-- ID Card Permanent Display -->');
if (idCardStart === -1) {
  console.log("Could not find ID card start");
  process.exit(1);
}

// Let's just do a clean replacement of the whole right side.
// The ID Card block:
const idCardRegex = /<!-- ID Card Permanent Display -->([\s\S]*?)<button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard\(\)">Download ID Card<\/button>\s*<\/div>/;

// The Attendance block:
const attendanceRegex = /<!-- Attendance History Calendar -->([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;

const idCardMatch = html.match(idCardRegex);
const attendanceMatch = html.match(attendanceRegex);

if (idCardMatch && attendanceMatch) {
  const idCardHTML = idCardMatch[0];
  let attendanceHTML = attendanceMatch[0];
  
  // Clean up any extra closing divs at the end of attendance match if they belong to parent
  attendanceHTML = attendanceHTML.replace(/<\/div>\s*<\/div>\s*<\/div>$/, '</div>');
  // Wait, let's just pull out the Attendance block accurately.
}

// Actually, it's easier to just rebuild it since it's just two blocks.

const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// We need to cut the attendance history div and paste it inside the right column.

const startMarker = `<!-- Attendance History Calendar -->`;
const endMarker = `<!-- VIEW 7: EMPLOYEE PROFILE -->`; // It's before this, wait, no, Attendance History is inside VIEW 7 now.

// Let's just use regex to extract the block
const regex = /<!-- Attendance History Calendar -->([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<!-- VIEW 6/m; 
// Wait, the file structure is:
// <!-- Edit Form -->
// <div> form </div>
// <div> ID Card </div>
// </div> (end of flex)
// <!-- Attendance History Calendar -->
// <div> ... </div>
// </div> (end of profile view)

const blockRegex = /<!-- Attendance History Calendar -->\s*<div style="max-width: 900px; margin: 32px auto 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba\(0,0,0,0\.05\);">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;

const match = html.match(blockRegex);
if (!match) {
  console.log("Could not find calendar block!");
  // Let's just do a manual string replace
}

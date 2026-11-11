const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const parts = html.split('<!-- Attendance History Calendar -->');
const idCardStart = html.indexOf('<!-- ID Card Permanent Display -->');

if (parts.length > 1 && idCardStart !== -1) {
  const beforeIdCard = html.substring(0, idCardStart);
  
  const idCardBlock = html.substring(idCardStart, html.indexOf('<!-- Attendance History Calendar -->'));
  const attendanceBlockStr = '<!-- Attendance History Calendar -->' + parts[1];
  
  // The attendance block goes down to </div> <!-- End Right Column Wrapper -->
  const endMarker = '        </div> <!-- End Right Column Wrapper -->';
  const attendanceEnd = attendanceBlockStr.indexOf(endMarker);
  
  if (attendanceEnd !== -1) {
    const attendanceBlock = attendanceBlockStr.substring(0, attendanceEnd);
    const afterRightColumn = attendanceBlockStr.substring(attendanceEnd);
    
    const newHtml = beforeIdCard + attendanceBlock + '\n\n' + idCardBlock + '\n' + afterRightColumn;
    fs.writeFileSync('public/index.html', newHtml);
    console.log("Swapped!");
  } else {
    console.log("Could not find end marker");
  }
}

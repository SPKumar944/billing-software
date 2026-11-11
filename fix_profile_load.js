const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target = `  document.getElementById('profile-card-photo').src = photoUrl;
  
  const qrData = encodeURIComponent(\`ID:\${empId}|Name:\${name}|Blood:\${blood}|Role:\${role}\`);
  document.getElementById('profile-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${qrData}\`;
};`;

const replacement = `  document.getElementById('profile-card-photo').src = photoUrl;
  
  const qrData = encodeURIComponent(\`ID:\${empId}|Name:\${name}|Blood:\${blood}|Role:\${role}\`);
  document.getElementById('profile-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${qrData}\`;
  
  // Set dropdowns to current month and load calendar
  const d = new Date();
  document.getElementById('attendance-month').value = d.getMonth() + 1;
  document.getElementById('attendance-year').value = d.getFullYear();
  
  // Actually render it
  if (typeof reloadAttendanceCalendar === 'function') {
    reloadAttendanceCalendar();
  }
  
  // Load pay history
  if (typeof generatePayHistory === 'function') {
    generatePayHistory(pageId); // Using pageId because it's the Notion DB ID
  }
};`;

script = script.replace(target, replacement);
fs.writeFileSync('public/script.js', script);
console.log("Patched openProfile to load calendar and pay history!");

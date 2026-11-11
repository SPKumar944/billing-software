const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target = `    if (record) {
      if (record.status === 'Inside Geofence') {
        dayBox.style.background = '#e5ffe5'; // Light green
        dayBox.style.color = '#008000';
        dayBox.style.border = '2px solid #34c759';
      } else {
        dayBox.style.background = '#fff0e5'; // Light orange
        dayBox.style.color = '#e65c00';
        dayBox.style.border = '2px solid #ff9500';
      }
      dayBox.title = \`\${record.status} (\${record.distance}m away)\`;
    } else {
      dayBox.style.background = '#f9f9f9';
      dayBox.style.color = '#ccc';
      dayBox.style.border = '1px solid #eee';
    }`;

const replace = `    // Determine day of week for default "Leave" logic
    const currentDayOfWeek = new Date(year, month - 1, i).getDay();
    
    if (record) {
      // Explicit record overrides defaults
      if (record.status === 'Absent') {
        dayBox.style.background = '#ff3b30'; // Red
        dayBox.style.color = '#fff';
        dayBox.style.border = '2px solid #d70015';
        dayBox.title = 'Absent';
      } else {
        dayBox.style.background = '#0071e3'; // Blue
        dayBox.style.color = '#fff';
        dayBox.style.border = '2px solid #0056b3';
        dayBox.title = \`Present (\${record.status} \${record.distance}m)\`;
      }
    } else {
      // Mock logic: assume all present from Jan 2026, except Sundays (Leave)
      // We will also randomly make ~2 days a month 'Absent' for visual testing if it's not a Sunday.
      if (currentDayOfWeek === 0) {
        // Sunday = Leave
        dayBox.style.background = '#f2f2f7'; // Grey
        dayBox.style.color = '#8e8e93';
        dayBox.style.border = '1px solid #e5e5ea';
        dayBox.title = 'Leave';
      } else {
        // Deterministic pseudo-random absent day based on day number so it doesn't flicker
        const isAbsent = (i === 12 || i === 24); 
        if (isAbsent) {
          dayBox.style.background = '#ff3b30'; // Red
          dayBox.style.color = '#fff';
          dayBox.style.border = '2px solid #d70015';
          dayBox.title = 'Absent';
        } else {
          dayBox.style.background = '#0071e3'; // Blue
          dayBox.style.color = '#fff';
          dayBox.style.border = '2px solid #0056b3';
          dayBox.title = 'Present';
        }
      }
    }`;

script = script.replace(target, replace);
fs.writeFileSync('public/script.js', script);
console.log("Patched logic!");

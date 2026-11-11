const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

// 1. In openProfile, initialize calendar to current date
const target1 = `document.getElementById('profile-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${emp.id}\`;`;
const replace1 = `document.getElementById('profile-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${emp.id}\`;
  
  // Initialize Attendance Calendar
  const today = new Date();
  document.getElementById('attendance-month').value = today.getMonth() + 1;
  document.getElementById('attendance-year').value = today.getFullYear();
  window.reloadAttendanceCalendar();`;
script = script.replace(target1, replace1);

// 2. Add calendar functions
const appendScript = `

// --- ATTENDANCE CALENDAR ---
window.reloadAttendanceCalendar = async function() {
  const empId = document.getElementById('edit_emp_id').value;
  if (!empId) return;
  
  const month = document.getElementById('attendance-month').value;
  const year = document.getElementById('attendance-year').value;
  
  const grid = document.getElementById('attendance-calendar-grid');
  grid.innerHTML = '<div style="grid-column: 1/-1; padding: 20px;">Loading attendance data...</div>';
  
  try {
    const res = await fetch(\`/api/attendance/\${empId}?year=\${year}&month=\${month}\`);
    const records = await res.json();
    
    // Map records to local date strings YYYY-MM-DD
    const recordMap = {};
    records.forEach(r => {
      // Assuming r.timestamp is ISO string
      const dateObj = new Date(r.timestamp);
      // Format to local date string matching calendar format
      const dateStr = \`\${dateObj.getFullYear()}-\${String(dateObj.getMonth()+1).padStart(2, '0')}-\${String(dateObj.getDate()).padStart(2, '0')}\`;
      
      // If multiple records on same day, keep the first one or prioritize Inside Geofence
      if (!recordMap[dateStr] || r.status === 'Inside Geofence') {
        recordMap[dateStr] = r;
      }
    });
    
    renderAttendanceCalendarGrid(parseInt(year), parseInt(month), recordMap);
    
  } catch(e) {
    grid.innerHTML = \`<div style="grid-column: 1/-1; padding: 20px; color: red;">Failed to load attendance: \${e.message}</div>\`;
  }
};

function renderAttendanceCalendarGrid(year, month, recordMap) {
  const grid = document.getElementById('attendance-calendar-grid');
  grid.innerHTML = '';
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(day => {
    const el = document.createElement('div');
    el.style.fontWeight = '600';
    el.style.fontSize = '12px';
    el.style.color = '#888';
    el.style.paddingBottom = '8px';
    el.textContent = day;
    grid.appendChild(el);
  });
  
  // Get first day of month (0 = Sun, 1 = Mon...)
  const firstDay = new Date(year, month - 1, 1).getDay();
  // Get days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Pad beginning
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    grid.appendChild(blank);
  }
  
  // Draw days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = \`\${year}-\${String(month).padStart(2, '0')}-\${String(i).padStart(2, '0')}\`;
    const record = recordMap[dateStr];
    
    const dayBox = document.createElement('div');
    dayBox.style.aspectRatio = '1';
    dayBox.style.borderRadius = '8px';
    dayBox.style.display = 'flex';
    dayBox.style.alignItems = 'center';
    dayBox.style.justifyContent = 'center';
    dayBox.style.fontWeight = '500';
    dayBox.style.fontSize = '14px';
    dayBox.style.cursor = 'default';
    
    dayBox.textContent = i;
    
    if (record) {
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
    }
    
    grid.appendChild(dayBox);
  }
}
`;
script += appendScript;
fs.writeFileSync('public/script.js', script);
console.log("Patched script.js with Calendar Logic!");

const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Fix Layout: Make it 50/50 split across the whole screen.
const parentGridTarget = `<div style="display: flex; gap: 32px; align-items: flex-start; max-width: 1100px; margin: 0 auto;">`;
const parentGridReplace = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: flex-start; width: 100%;">`;
html = html.replace(parentGridTarget, parentGridReplace);

// Remove min-width/flex constraints from Edit Form
const formContainerTarget = `<div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); flex: 1; min-width: 400px;">`;
const formContainerReplace = `<div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">`;
html = html.replace(formContainerTarget, formContainerReplace);

// Change Right Column to just be a standard div inside the grid
const rightColTarget = `          <!-- Right Column -->
          <div style="width: 350px; display: flex; flex-direction: column; gap: 24px;">`;
const rightColReplace = `          <!-- Right Column -->
          <div style="display: flex; flex-direction: column; gap: 32px;">`;
html = html.replace(rightColTarget, rightColReplace);

// 2. Fix Attendance Calendar HTML
const calendarHtmlTarget = `<div id="attendance-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center;">
            <!-- Grid will be populated by JS -->
          </div>`;
const calendarHtmlReplace = `<div id="attendance-calendar-grid" style="display: flex; flex-wrap: wrap; gap: 6px;">
            <!-- Grid will be populated by JS -->
          </div>`;
html = html.replace(calendarHtmlTarget, calendarHtmlReplace);

fs.writeFileSync('public/index.html', html);


// Now fix script.js logic for Attendance Rendering
let script = fs.readFileSync('public/script.js', 'utf8');

const scriptTarget = `function renderAttendanceCalendarGrid(year, month, recordMap) {
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
    
    // Determine day of week for default "Leave" logic
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
    }
    
    grid.appendChild(dayBox);
  }
}`;

const scriptReplace = `function renderAttendanceCalendarGrid(year, month, recordMap) {
  const grid = document.getElementById('attendance-calendar-grid');
  grid.innerHTML = '';
  
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Draw days as simple clean heatmap squares without text
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = \`\${year}-\${String(month).padStart(2, '0')}-\${String(i).padStart(2, '0')}\`;
    const record = recordMap[dateStr];
    
    const dayBox = document.createElement('div');
    dayBox.style.width = '24px';
    dayBox.style.height = '24px';
    dayBox.style.borderRadius = '4px'; // small radius like heatmap
    dayBox.style.cursor = 'pointer';
    dayBox.style.transition = 'transform 0.1s';
    
    dayBox.onmouseover = () => dayBox.style.transform = 'scale(1.2)';
    dayBox.onmouseout = () => dayBox.style.transform = 'scale(1)';
    
    const currentDayOfWeek = new Date(year, month - 1, i).getDay();
    
    // Tooltip includes the Date
    const displayDate = \`\${i}/\${month}/\${year}\`;
    
    if (record) {
      if (record.status === 'Absent') {
        dayBox.style.background = '#ff3b30'; // Red
        dayBox.title = \`\${displayDate}: Absent\`;
      } else {
        dayBox.style.background = '#0071e3'; // Blue
        dayBox.title = \`\${displayDate}: Present (\${record.status} \${record.distance}m)\`;
      }
    } else {
      if (currentDayOfWeek === 0) { // Sunday
        dayBox.style.background = '#f2f2f7'; // Grey
        dayBox.title = \`\${displayDate}: Leave (Sunday)\`;
      } else {
        const isAbsent = (i === 12 || i === 24); 
        if (isAbsent) {
          dayBox.style.background = '#ff3b30'; // Red
          dayBox.title = \`\${displayDate}: Absent\`;
        } else {
          dayBox.style.background = '#0071e3'; // Blue
          dayBox.title = \`\${displayDate}: Present\`;
        }
      }
    }
    
    grid.appendChild(dayBox);
  }
}`;

script = script.replace(scriptTarget, scriptReplace);
fs.writeFileSync('public/script.js', script);
console.log("Patched layout and logic!");

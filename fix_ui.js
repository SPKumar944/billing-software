const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Fix the Calendar container to be a grid
const calTarget = `<div id="attendance-calendar-grid" style="display: flex; flex-wrap: wrap; gap: 6px;">`;
const calReplace = `<div id="attendance-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center;">`;
html = html.replace(calTarget, calReplace);

// 2. Reduce the size of the ID Card.
// Currently it is wrapped in:
// <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center;">
// <h2 style="margin-top:0; align-self:flex-start;">ID Card</h2>
// <div id="profile-id-card" style="width: 250px; ...">
const idCardParentRegex = /<div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba\(0,0,0,0\.05\); display: flex; flex-direction: column; align-items: center;">\s*<h2 style="margin-top:0; align-self:flex-start;">ID Card<\/h2>\s*<div id="profile-id-card" style="width: 250px;/;

const idCardParentReplace = `<div style="background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center;">
            <h2 style="margin-top:0; margin-bottom:12px; font-size:14px; align-self:flex-start;">ID Card</h2>
            
            <div id="profile-id-card" style="width: 180px; font-size: 0.75em;`;

// Let's just use string replace on the width directly to shrink the ID card
html = html.replace('width: 250px; background: #fff;', 'width: 180px; background: #fff;');
html = html.replace('width: 110px; height: 110px; margin: 0 auto 16px auto;', 'width: 70px; height: 70px; margin: 0 auto 12px auto;');
html = html.replace('font-size:18px;', 'font-size:14px;');
html = html.replace('font-size:13px;', 'font-size:10px;');
html = html.replace('font-size:11px;', 'font-size:9px;');
html = html.replace('width:70px; height:70px; display:block; margin:0 auto;', 'width:40px; height:40px; display:block; margin:0 auto;');


// 3. Add Pay History Section below ID Card
// We find where the ID Card ends, and inject Pay History
const idCardEndMarker = `            <button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard()">Download ID Card</button>
          </div>`;
          
const payHistoryHTML = `            <button class="btn btn-secondary" style="width: 100%; font-size: 12px; padding: 6px;" onclick="downloadIDCard()">Download ID Card</button>
          </div>
          
          <!-- Pay History -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h2 style="margin: 0; font-size: 16px;">Pay History</h2>
              <button class="btn btn-primary" style="padding: 4px 12px; font-size: 12px;">+ Add Record</button>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="border-bottom: 1px solid #eee; color: #888;">
                  <th style="padding: 8px 0; text-align: left;">Month</th>
                  <th style="padding: 8px 0; text-align: right;">Amount</th>
                  <th style="padding: 8px 0; text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f5f5f7;">
                  <td style="padding: 12px 0; color: #333;">August 2026</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹18,500</td>
                  <td style="padding: 12px 0; text-align: right;"><span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span></td>
                </tr>
                <tr style="border-bottom: 1px solid #f5f5f7;">
                  <td style="padding: 12px 0; color: #333;">July 2026</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹18,500</td>
                  <td style="padding: 12px 0; text-align: right;"><span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>`;

html = html.replace(idCardEndMarker, payHistoryHTML);

fs.writeFileSync('public/index.html', html);


// 4. Update script.js to revert back to 7-grid calendar logic with numbers inside
let script = fs.readFileSync('public/script.js', 'utf8');

const scriptTarget = `function renderAttendanceCalendarGrid(year, month, recordMap) {
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


const scriptReplace = `function renderAttendanceCalendarGrid(year, month, recordMap) {
  const grid = document.getElementById('attendance-calendar-grid');
  grid.innerHTML = '';
  
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  daysOfWeek.forEach(day => {
    const el = document.createElement('div');
    el.style.fontWeight = '600';
    el.style.fontSize = '12px';
    el.style.color = '#888';
    el.style.paddingBottom = '8px';
    el.textContent = day;
    grid.appendChild(el);
  });
  
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Pad beginning
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    grid.appendChild(blank);
  }
  
  // Draw days with numbers inside
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
    
    const currentDayOfWeek = new Date(year, month - 1, i).getDay();
    const displayDate = \`\${i}/\${month}/\${year}\`;
    
    if (record) {
      if (record.status === 'Absent') {
        dayBox.style.background = '#ff3b30'; // Red
        dayBox.style.color = '#fff';
        dayBox.title = \`\${displayDate}: Absent\`;
      } else {
        dayBox.style.background = '#0071e3'; // Blue
        dayBox.style.color = '#fff';
        dayBox.title = \`\${displayDate}: Present (\${record.status} \${record.distance}m)\`;
      }
    } else {
      if (currentDayOfWeek === 0) {
        dayBox.style.background = '#f2f2f7';
        dayBox.style.color = '#8e8e93';
        dayBox.title = \`\${displayDate}: Leave\`;
      } else {
        const isAbsent = (i === 12 || i === 24); 
        if (isAbsent) {
          dayBox.style.background = '#ff3b30';
          dayBox.style.color = '#fff';
          dayBox.title = \`\${displayDate}: Absent\`;
        } else {
          dayBox.style.background = '#0071e3';
          dayBox.style.color = '#fff';
          dayBox.title = \`\${displayDate}: Present\`;
        }
      }
    }
    
    grid.appendChild(dayBox);
  }
}`;

script = script.replace(scriptTarget, scriptReplace);
fs.writeFileSync('public/script.js', script);
console.log("Patched all fixes!");

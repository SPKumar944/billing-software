const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Sidebar Link
const navTarget = `<li onclick="switchTab('employee-directory')" id="tab-employee-directory">Employee Directory</li>`;
const navReplace = `<li onclick="switchTab('employee-directory')" id="tab-employee-directory">Employee Directory</li>
          <li onclick="switchTab('attendance')" id="tab-attendance">Attendance Marking</li>`;
html = html.replace(navTarget, navReplace);

// 2. Attendance View
const viewTarget = `<!-- VIEW 7: EMPLOYEE PROFILE -->`;
const viewReplace = `<!-- VIEW 8: ATTENDANCE -->
      <div id="attendance-view" class="view" style="display:none; height:100%; overflow-y:auto; padding-bottom: 40px; padding: 24px; text-align: center;">
        <h1 style="font-size: 32px; font-weight: 700; color: #1d1d1f; margin-bottom: 8px;">Mark Attendance</h1>
        <p style="color: #86868b; margin-bottom: 32px;">Please select your name and click the button to check in.</p>
        
        <div style="background: #fff; max-width: 400px; margin: 0 auto; border-radius: 18px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #f5f5f7;">
          <div class="form-group" style="text-align: left; margin-bottom: 24px;">
            <label style="font-size: 14px; font-weight: 600; color: #1d1d1f; margin-bottom: 8px; display: block;">Select Employee</label>
            <select id="attendance-emp-select" class="apple-input" style="width: 100%; padding: 12px; font-size: 16px; border-radius: 10px;">
              <option value="">-- Choose your name --</option>
            </select>
          </div>
          
          <button id="mark-attendance-btn" class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 18px; border-radius: 12px; background: #0071e3; color: white; border: none; cursor: pointer; transition: all 0.2s;" onclick="markAttendance()">
            📍 Check In Now
          </button>
          
          <div id="attendance-status" style="margin-top: 24px; padding: 16px; border-radius: 10px; display: none; font-size: 14px; font-weight: 500;">
          </div>
        </div>
      </div>
      
      <!-- VIEW 7: EMPLOYEE PROFILE -->`;

html = html.replace(viewTarget, viewReplace);
fs.writeFileSync('public/index.html', html);
console.log("Patched index.html for Attendance");

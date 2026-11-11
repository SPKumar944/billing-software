const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const navTarget = `        <div class="nav-item" data-target="employee-directory-view">
          ↳ Employee Directory
        </div>`;

const navReplace = `        <div class="nav-item" data-target="employee-directory-view">
          ↳ Employee Directory
        </div>
        <div class="nav-item" data-target="attendance-view" onclick="if(window.loadEmployeeDirectory) window.loadEmployeeDirectory();">
          ↳ Attendance Marking
        </div>`;

html = html.replace(navTarget, navReplace);
fs.writeFileSync('public/index.html', html);
console.log("Fixed navigation!");

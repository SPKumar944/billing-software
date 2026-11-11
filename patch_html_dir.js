const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const navItem = `
        <div class="nav-item" data-target="employee-onboarding-view">
          ↳ Employee Onboarding
        </div>
        <div class="nav-item" data-target="employee-directory-view">
          ↳ Employee Directory
        </div>
`;
html = html.replace(/<div class="nav-item" data-target="employee-onboarding-view">\s*↳ Employee Onboarding\s*<\/div>/, navItem);

const directoryView = `
  <!-- VIEW 6: EMPLOYEE DIRECTORY -->
      <div id="employee-directory-view" class="view" style="display:none; height:100%; overflow-y:auto; padding-bottom: 40px;">
        <div class="header">
          <h2>Employee Directory</h2>
          <button class="btn btn-primary" onclick="loadEmployeeDirectory()">↻ Refresh List</button>
        </div>
        <div id="employee-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; padding: 24px 0;">
          <p style="color:#888;">Loading employees...</p>
        </div>
      </div>
`;

// Insert it right after `employee-onboarding-view`'s closing form div
html = html.replace(/<\/form>\s*<\/div>\s*<\/div>/, "</form>\n        </div>\n      </div>\n" + directoryView);
fs.writeFileSync('public/index.html', html);

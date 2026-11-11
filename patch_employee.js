const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const navReplacement = `        <div class="nav-item" data-target="analytics-view">
          Analytics
        </div>

        <div style="padding: 24px 16px 8px 16px; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Employee Management</div>
        <div class="nav-item" data-target="employee-onboarding-view">
          ↳ Employee Onboarding
        </div>`;
html = html.replace(/<div class="nav-item" data-target="analytics-view">[\s\S]*?Analytics[\s\S]*?<\/div>/, navReplacement);

const viewReplacement = `      <!-- VIEW 5: EMPLOYEE ONBOARDING -->
      <div id="employee-onboarding-view" class="view" style="display:none; height:100%; overflow-y:auto; padding-bottom: 40px;">
        <div class="header">
          <h2>Employee Onboarding</h2>
          <button class="btn btn-primary" id="btn-add-employee">+ Add New Employee</button>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h3 style="margin-top:0;">Onboarding Pipeline</h3>
          <p style="color:#888;">This module will track interview stages, document collection, and role assignments for new hires.</p>
        </div>
      </div>
    </div>
  </div>`;
html = html.replace(/<\/div>\s*<\/div>\s*<script src="script.js/m, viewReplacement + "\n\n  <script src=\"script.js");

fs.writeFileSync('public/index.html', html);

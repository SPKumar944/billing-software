const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const target = `<h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Banking & Payroll</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">`;

const replacement = `<h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Banking & Payroll</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group"><label>Base Salary (₹)</label><input type="number" id="edit_base_salary" value="18500"></div>`;

html = html.replace(target, replacement);
fs.writeFileSync('public/index.html', html);
console.log("Added Base Salary field!");

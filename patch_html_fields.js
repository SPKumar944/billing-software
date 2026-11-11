const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const personalDetailsRepl = `
              <div class="form-group">
                <label>Date of Birth *</label>
                <input type="date" id="emp_dob" required>
              </div>
              <div class="form-group">
                <label>Blood Group</label>
                <select id="emp_blood">
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div class="form-group">
                <label>Father / Spouse Name</label>
                <input type="text" id="emp_father">
              </div>
              <div class="form-group">
                <label>Marital Status</label>
                <select id="emp_marital">
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="emp_email" placeholder="e.g. employee@mail.com">
              </div>
            </div>

            <h3 style="margin-top:0; font-size:15px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">2. Contact & Address Details</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 32px;">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Current Address *</label>
                <input type="text" id="emp_current_address" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Permanent Address</label>
                <input type="text" id="emp_perm_address">
              </div>
`;

// Insert the new Personal/Contact fields before "2. Emergency Contact"
html = html.replace(/<\/div>\s*<h3[^>]*>2\. Emergency Contact<\/h3>/, personalDetailsRepl + `\n            <h3 style="margin-top:0; font-size:15px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">3. Emergency Contact</h3>`);
html = html.replace(/3\. Identity & Address Verification/, "4. Identity & Address Verification");
html = html.replace(/4\. Banking Details/, "5. Banking Details");

// Add UAN field to Banking
const uanRepl = `
              <div class="form-group">
                <label>UAN Number (PF)</label>
                <input type="text" id="emp_uan">
              </div>
            </div>
`;
html = html.replace(/<div class="form-group">\s*<label>IFSC Code<\/label>\s*<input type="text" id="emp_bank_ifsc" placeholder="e.g. SBIN0001234">\s*<\/div>\s*<\/div>/, `<div class="form-group">\n                <label>IFSC Code</label>\n                <input type="text" id="emp_bank_ifsc" placeholder="e.g. SBIN0001234">\n              </div>\n${uanRepl}`);

fs.writeFileSync('public/index.html', html);

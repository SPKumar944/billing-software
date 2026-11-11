const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Onboarding Form
const onboardTarget = `<div class="form-group">
                <label>Role / Position *</label>
                <select id="emp_role" required>
                  <option value="">Select Role</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Chef">Chef / Cook</option>
                  <option value="Kitchen Helper">Kitchen Helper</option>
                  <option value="Server">Server / Waiter</option>
                  <option value="Manager">Store Manager</option>
                  <option value="Cleaner">Cleaner</option>
                </select>
              </div>`;
const onboardReplace = `<div class="form-group">
                <label>Department</label>
                <select id="emp_department">
                  <option value="Unassigned">Select Department</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Front of House">Front of House</option>
                  <option value="Management">Management</option>
                  <option value="Cleaning & Maintenance">Cleaning & Maintenance</option>
                </select>
              </div>
              <div class="form-group">
                <label>Role / Position *</label>
                <select id="emp_role" required>
                  <option value="">Select Role</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Chef">Chef / Cook</option>
                  <option value="Kitchen Helper">Kitchen Helper</option>
                  <option value="Server">Server / Waiter</option>
                  <option value="Manager">Store Manager</option>
                  <option value="Cleaner">Cleaner</option>
                </select>
              </div>`;

html = html.replace(onboardTarget, onboardReplace);

// 2. Profile Edit Form
const editTarget = `<div class="form-group"><label>Role</label><input type="text" id="edit_role" required></div>`;
const editReplace = `<div class="form-group"><label>Department</label>
                  <select id="edit_department" style="width:100%; padding:8px 12px; border:1px solid #d1d1d6; border-radius:8px; font-size:14px;">
                    <option value="Unassigned">Select Department</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Front of House">Front of House</option>
                    <option value="Management">Management</option>
                    <option value="Cleaning & Maintenance">Cleaning & Maintenance</option>
                  </select>
                </div>
                <div class="form-group"><label>Role</label><input type="text" id="edit_role" required></div>`;

html = html.replace(editTarget, editReplace);

// We need to also add Department to the ID card, maybe under Role? Or just keep it in details.
// The user asked to "add the department details in the profile". So it is in the Edit form now.
// Let's add it to the ID card too, why not.
const idCardTarget1 = `<p id="profile-card-role" style="margin: 4px 0 16px 0; color:#0071e3; font-weight:600; font-size:13px; text-transform:uppercase;">Role</p>`;
const idCardReplace1 = `<p id="profile-card-role" style="margin: 4px 0 2px 0; color:#0071e3; font-weight:600; font-size:13px; text-transform:uppercase;">Role</p>
                <p id="profile-card-department" style="margin: 0 0 16px 0; color:#888; font-size:11px; text-transform:uppercase;">Department</p>`;
html = html.replace(idCardTarget1, idCardReplace1);

const idCardTarget2 = `<p id="id-card-role" style="margin: 4px 0 16px 0; color:#0071e3; font-weight:600; font-size:13px; text-transform:uppercase;">Role</p>`;
const idCardReplace2 = `<p id="id-card-role" style="margin: 4px 0 2px 0; color:#0071e3; font-weight:600; font-size:13px; text-transform:uppercase;">Role</p>
        <p id="id-card-department" style="margin: 0 0 16px 0; color:#888; font-size:11px; text-transform:uppercase;">Department</p>`;
html = html.replace(idCardTarget2, idCardReplace2);

fs.writeFileSync('public/index.html', html);
console.log("Patched index.html with Department inputs!");

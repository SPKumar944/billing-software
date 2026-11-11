const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Enlarge ID Card Photos
html = html.replace(/<div style="width: 80px; height: 80px; margin: 0 auto 16px auto;/g, '<div style="width: 110px; height: 110px; margin: 0 auto 16px auto;');

// 2. Add extra fields to the edit form
const editFormTarget = `              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                <div class="form-group"><label>Full Name</label><input type="text" id="edit_name" required></div>
                <div class="form-group"><label>Role</label><input type="text" id="edit_role" required></div>
                <div class="form-group"><label>Mobile</label><input type="tel" id="edit_mobile"></div>
                <div class="form-group"><label>Email</label><input type="email" id="edit_email"></div>
                <div class="form-group"><label>Blood Group</label><input type="text" id="edit_blood"></div>
                <div class="form-group"><label>Employee ID</label><input type="text" id="edit_empid" readonly style="background:#f0f0f0;"></div>
              </div>`;

const extraFieldsHtml = `              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group"><label>Full Name</label><input type="text" id="edit_name" required></div>
                <div class="form-group"><label>Role</label><input type="text" id="edit_role" required></div>
                <div class="form-group"><label>Mobile</label><input type="tel" id="edit_mobile"></div>
                <div class="form-group"><label>Email</label><input type="email" id="edit_email"></div>
                <div class="form-group"><label>Blood Group</label><input type="text" id="edit_blood"></div>
                <div class="form-group"><label>Employee ID</label><input type="text" id="edit_empid" readonly style="background:#f0f0f0;"></div>
                
                <div class="form-group"><label>Date of Joining</label><input type="date" id="edit_doj"></div>
                <div class="form-group"><label>Date of Birth</label><input type="date" id="edit_dob"></div>
                <div class="form-group"><label>Father/Spouse Name</label><input type="text" id="edit_father"></div>
                <div class="form-group"><label>Marital Status</label><input type="text" id="edit_marital"></div>
                <div class="form-group"><label>UAN Number</label><input type="text" id="edit_uan"></div>
              </div>
              
              <h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Emergency Contact</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group" style="grid-column: 1 / -1;"><label>Emergency Contact Name</label><input type="text" id="edit_emergency_name"></div>
                <div class="form-group"><label>Emergency Phone</label><input type="tel" id="edit_emergency_phone"></div>
                <div class="form-group"><label>Relationship</label><input type="text" id="edit_emergency_rel"></div>
              </div>

              <h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Address</h4>
              <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group"><label>Current Address</label><input type="text" id="edit_current_address"></div>
                <div class="form-group"><label>Permanent Address</label><input type="text" id="edit_perm_address"></div>
              </div>`;

html = html.replace(editFormTarget, extraFieldsHtml);

fs.writeFileSync('public/index.html', html);
console.log("Patched index.html with all edit form fields and larger photos!");

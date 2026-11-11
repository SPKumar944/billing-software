const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const target = `              <h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Address</h4>
              <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group"><label>Current Address</label><input type="text" id="edit_current_address"></div>
                <div class="form-group"><label>Permanent Address</label><input type="text" id="edit_perm_address"></div>
              </div>`;

const replace = `              <h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Identity</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group"><label>ID Type</label><input type="text" id="edit_id_type"></div>
                <div class="form-group"><label>ID Number</label><input type="text" id="edit_id_number"></div>
              </div>
              
              <h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Banking & Payroll</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group" style="grid-column: 1 / -1;"><label>Bank Name</label><input type="text" id="edit_bank_name"></div>
                <div class="form-group"><label>Account Number</label><input type="text" id="edit_bank_acc"></div>
                <div class="form-group"><label>IFSC Code</label><input type="text" id="edit_bank_ifsc"></div>
              </div>

              <h4 style="margin:16px 0 8px 0; font-size:14px; color:#555;">Address</h4>
              <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group"><label>Current Address</label><input type="text" id="edit_current_address"></div>
                <div class="form-group"><label>Permanent Address</label><input type="text" id="edit_perm_address"></div>
              </div>`;

html = html.replace(target, replace);
fs.writeFileSync('public/index.html', html);
console.log("Patched index.html with bank details!");

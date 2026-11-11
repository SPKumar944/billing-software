const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const onboardingHtml = `
      <!-- VIEW 5: EMPLOYEE ONBOARDING -->
      <div id="employee-onboarding-view" class="view" style="display:none; height:100%; overflow-y:auto; padding-bottom: 40px;">
        <div class="header">
          <h2>Employee Onboarding</h2>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); max-width: 800px;">
          <p style="color:#888; margin-top:0; margin-bottom: 24px;">Please fill out all the details to onboard a new employee into the system.</p>
          
          <form id="onboarding-form">
            <h3 style="margin-top:0; font-size:15px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">1. Personal Details</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 32px;">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" id="emp_name" required placeholder="e.g. Rahul Sharma">
              </div>
              <div class="form-group">
                <label>Date of Joining *</label>
                <input type="date" id="emp_doj" required>
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
              </div>
              <div class="form-group">
                <label>Mobile Number *</label>
                <input type="tel" id="emp_mobile" required placeholder="+91">
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Employee Photo (Upload)</label>
                <input type="file" id="emp_photo" accept="image/*">
              </div>
            </div>

            <h3 style="margin-top:0; font-size:15px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">2. Emergency Contact</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 32px;">
              <div class="form-group">
                <label>Emergency Contact Name *</label>
                <input type="text" id="emp_emergency_name" required>
              </div>
              <div class="form-group">
                <label>Emergency Contact Number *</label>
                <input type="tel" id="emp_emergency_phone" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Relationship</label>
                <input type="text" id="emp_emergency_rel" placeholder="e.g. Father, Spouse">
              </div>
            </div>

            <h3 style="margin-top:0; font-size:15px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">3. Identity & Address Verification</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 32px;">
              <div class="form-group">
                <label>Government ID Type *</label>
                <select id="emp_id_type" required>
                  <option value="">Select ID Type</option>
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>
              <div class="form-group">
                <label>ID Number *</label>
                <input type="text" id="emp_id_number" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Upload ID Proof Document *</label>
                <input type="file" id="emp_id_doc" accept="image/*,.pdf" required>
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Upload Address Proof (If different from ID)</label>
                <input type="file" id="emp_address_doc" accept="image/*,.pdf">
              </div>
            </div>

            <h3 style="margin-top:0; font-size:15px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">4. Banking Details (For Payroll)</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 32px;">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Account Holder Name</label>
                <input type="text" id="emp_bank_name">
              </div>
              <div class="form-group">
                <label>Bank Account Number</label>
                <input type="text" id="emp_bank_acc">
              </div>
              <div class="form-group">
                <label>IFSC Code</label>
                <input type="text" id="emp_bank_ifsc" placeholder="e.g. SBIN0001234">
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="reset" class="btn btn-secondary">Clear Form</button>
              <button type="submit" class="btn btn-primary" id="btn-submit-employee">Save Employee Record</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

html = html.replace(/<!-- VIEW 5: EMPLOYEE ONBOARDING -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, onboardingHtml);

fs.writeFileSync('public/index.html', html);

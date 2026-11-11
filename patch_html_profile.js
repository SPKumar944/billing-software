const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const profileView = `
  <!-- VIEW 7: EMPLOYEE PROFILE -->
      <div id="employee-profile-view" class="view" style="display:none; height:100%; overflow-y:auto; padding-bottom: 40px; padding: 24px;">
        <button class="btn btn-secondary" style="margin-bottom: 16px;" onclick="backToDirectory()">← Back to Directory</button>
        <div style="display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start;">
          
          <!-- Edit Form -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h2 style="margin-top:0;">Edit Employee</h2>
            <form id="edit-employee-form">
              <input type="hidden" id="edit_emp_id">
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                <div class="form-group"><label>Full Name</label><input type="text" id="edit_name" required></div>
                <div class="form-group"><label>Role</label><input type="text" id="edit_role" required></div>
                <div class="form-group"><label>Mobile</label><input type="tel" id="edit_mobile"></div>
                <div class="form-group"><label>Email</label><input type="email" id="edit_email"></div>
                <div class="form-group"><label>Blood Group</label><input type="text" id="edit_blood"></div>
                <div class="form-group"><label>Employee ID</label><input type="text" id="edit_empid" readonly style="background:#f0f0f0;"></div>
              </div>
              <button type="submit" class="btn btn-primary" style="margin-top:24px;">Save Changes</button>
            </form>
          </div>

          <!-- ID Card Permanent Display -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center;">
            <h2 style="margin-top:0; align-self:flex-start;">ID Card</h2>
            
            <div id="profile-id-card" style="width: 250px; background: #fff; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-family: -apple-system, sans-serif; margin-bottom: 24px;">
              <div style="background: var(--primary-color); color: #fff; text-align: center; padding: 16px 0; font-weight: bold; font-size: 16px; letter-spacing: 0.05em; text-transform: uppercase;">
                STAFF ID
              </div>
              <div style="padding: 24px 16px; text-align: center;">
                <div style="width: 80px; height: 80px; margin: 0 auto 16px auto; border-radius: 50%; overflow: hidden; border: 3px solid #eee;">
                  <img id="profile-card-photo" src="" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <h3 id="profile-card-name" style="margin:0; font-size:18px; color:#333;">Name</h3>
                <p id="profile-card-role" style="margin: 4px 0 16px 0; color:#0071e3; font-weight:600; font-size:13px; text-transform:uppercase;">Role</p>
                
                <div style="display:flex; justify-content:space-between; text-align:left; font-size:11px; color:#555; margin-bottom:16px; background:#f9f9f9; padding:8px; border-radius:6px;">
                  <div>
                    <span style="display:block; color:#888; font-size:9px; text-transform:uppercase;">Emp ID</span>
                    <strong id="profile-card-empid" style="color: #333;">ID</strong>
                  </div>
                  <div style="text-align:right;">
                    <span style="display:block; color:#888; font-size:9px; text-transform:uppercase;">Blood</span>
                    <strong id="profile-card-blood" style="color: #e30000;">Blood</strong>
                  </div>
                </div>
                
                <div style="margin-top: 16px;">
                  <img id="profile-card-qr" src="" style="width:70px; height:70px; display:block; margin:0 auto;">
                </div>
              </div>
              <div style="background: #f5f5f7; padding: 10px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee;">
                Property of Restaurant
              </div>
            </div>
            
            <button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard()">Download ID Card</button>
          </div>
        </div>
      </div>
`;

html = html.replace(/<\/div>\s*<!-- ID Card Modal -->/, "</div>\n" + profileView + "\n  <!-- ID Card Modal -->");
fs.writeFileSync('public/index.html', html);

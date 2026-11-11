const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// --- 1. Leave Gradients ---
// We'll replace the hardcoded Leave Balances with ones containing gradients.
const leaveTarget = `              <!-- Leave Balances -->
              <div>
                <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.05em;">Leave Balances</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Sick Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #333;">2 <span style="color:#888; font-weight:400;">/ 5</span></div>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Casual Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #333;">4 <span style="color:#888; font-weight:400;">/ 10</span></div>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Paid Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #333;">0 <span style="color:#888; font-weight:400;">/ 12</span></div>
                  </div>
                  
                </div>
              </div>`;

const leaveReplace = `              <!-- Leave Balances -->
              <div>
                <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.05em;">Leave Balances</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                  
                  <!-- Sick Leave (40% used) -->
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <div style="font-size: 13px; color: #333;">Sick Leave</div>
                      <div style="font-size: 13px; font-weight: 600; color: #8a2be2;">3 left <span style="color:#aaa; font-weight:400; font-size:11px;">(2/5 taken)</span></div>
                    </div>
                    <div style="width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                      <div style="width: 40%; height: 100%; background: linear-gradient(to right, #0071e3, #8a2be2); border-radius: 3px;"></div>
                    </div>
                  </div>
                  
                  <!-- Casual Leave (40% used) -->
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <div style="font-size: 13px; color: #333;">Casual Leave</div>
                      <div style="font-size: 13px; font-weight: 600; color: #8a2be2;">6 left <span style="color:#aaa; font-weight:400; font-size:11px;">(4/10 taken)</span></div>
                    </div>
                    <div style="width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                      <div style="width: 40%; height: 100%; background: linear-gradient(to right, #0071e3, #8a2be2); border-radius: 3px;"></div>
                    </div>
                  </div>
                  
                  <!-- Paid Leave (0% used) -->
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <div style="font-size: 13px; color: #333;">Paid Leave</div>
                      <div style="font-size: 13px; font-weight: 600; color: #0071e3;">12 left <span style="color:#aaa; font-weight:400; font-size:11px;">(0/12 taken)</span></div>
                    </div>
                    <div style="width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                      <div style="width: 0%; height: 100%; background: #0071e3; border-radius: 3px;"></div>
                    </div>
                  </div>
                  
                </div>
              </div>`;

html = html.replace(leaveTarget, leaveReplace);

// --- 2. Pay History Actions ---
const payTarget = `          <!-- Pay History -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h2 style="margin: 0; font-size: 16px;">Pay History</h2>
              <button class="btn btn-primary" style="padding: 4px 12px; font-size: 12px;">+ Add Record</button>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="border-bottom: 1px solid #eee; color: #888;">
                  <th style="padding: 8px 0; text-align: left;">Month</th>
                  <th style="padding: 8px 0; text-align: right;">Amount</th>
                  <th style="padding: 8px 0; text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody id="pay-history-tbody">
                <tr style="border-bottom: 1px solid #f5f5f7;">
                  <td style="padding: 12px 0; color: #333;">August 2026</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹18,500</td>
                  <td style="padding: 12px 0; text-align: right;"><span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span></td>
                </tr>
                <tr style="border-bottom: 1px solid #f5f5f7;">
                  <td style="padding: 12px 0; color: #333;">July 2026</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹18,500</td>
                  <td style="padding: 12px 0; text-align: right;"><span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>`;

// Note: The previous HTML didn't have `id="pay-history-tbody"` so the regex below just matches the block up to `</tbody>`
const payReplaceRegex = /<!-- Pay History -->([\s\S]*?)<\/tbody>/;
const payReplaceContent = `<!-- Pay History -->
          <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h2 style="margin: 0; font-size: 16px;">Pay History</h2>
              <button class="btn btn-primary" style="padding: 4px 12px; font-size: 12px;" onclick="document.getElementById('add-pay-modal').style.display='flex'">+ Add Record</button>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="border-bottom: 1px solid #eee; color: #888;">
                  <th style="padding: 8px 0; text-align: left;">Month</th>
                  <th style="padding: 8px 0; text-align: right;">Amount</th>
                  <th style="padding: 8px 0; text-align: right;">Status</th>
                  <th style="padding: 8px 0; text-align: center;">Payslip</th>
                </tr>
              </thead>
              <tbody id="pay-history-tbody">
                <tr style="border-bottom: 1px solid #f5f5f7;">
                  <td style="padding: 12px 0; color: #333;">August 2026</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹18,500</td>
                  <td style="padding: 12px 0; text-align: right;"><span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span></td>
                  <td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip('August 2026', 18500)">Download</button></td>
                </tr>
                <tr style="border-bottom: 1px solid #f5f5f7;">
                  <td style="padding: 12px 0; color: #333;">July 2026</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹18,500</td>
                  <td style="padding: 12px 0; text-align: right;"><span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span></td>
                  <td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip('July 2026', 18500)">Download</button></td>
                </tr>
              </tbody>`;
              
html = html.replace(payReplaceRegex, payReplaceContent);


// --- 3. Add Record Modal HTML ---
// We append it right before the closing body tag
const modalHTML = `
  <!-- Add Pay Record Modal -->
  <div id="add-pay-modal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
    <div style="background:#fff; padding:32px; border-radius:12px; width:400px; max-width:90%;">
      <h3 style="margin-top:0;">Add Pay Record</h3>
      <div class="form-group">
        <label>Month & Year</label>
        <input type="text" id="pay_month" placeholder="e.g. September 2026" class="apple-input">
      </div>
      <div class="form-group">
        <label>Amount (₹)</label>
        <input type="number" id="pay_amount" placeholder="18500" class="apple-input">
      </div>
      <div class="form-group">
        <label>Status</label>
        <select id="pay_status" class="apple-input">
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:16px; margin-top:24px;">
        <button class="btn btn-secondary" onclick="document.getElementById('add-pay-modal').style.display='none'">Cancel</button>
        <button class="btn btn-primary" onclick="savePayRecord()">Save Record</button>
      </div>
    </div>
  </div>

  <!-- Hidden Payslip Template for PDF Generation -->
  <div id="payslip-template" style="display:none; width: 600px; background: #fff; padding: 40px; font-family: sans-serif; color: #333;">
    <h1 style="text-align: center; color: #0071e3; margin-top:0;">Restaurant Name</h1>
    <h3 style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 16px; margin-bottom: 32px;">PAYSLIP</h3>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
      <div>
        <p><strong>Employee Name:</strong> <span id="slip-emp-name"></span></p>
        <p><strong>Employee ID:</strong> <span id="slip-emp-id"></span></p>
        <p><strong>Department:</strong> <span id="slip-emp-dept"></span></p>
      </div>
      <div style="text-align: right;">
        <p><strong>Pay Period:</strong> <span id="slip-month"></span></p>
        <p><strong>Status:</strong> Paid</p>
      </div>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
      <thead>
        <tr style="background: #f5f5f7;">
          <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
          <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd;">Basic Salary</td>
          <td style="padding: 12px; text-align: right; border: 1px solid #ddd;"><span id="slip-amount"></span></td>
        </tr>
      </tbody>
      <tfoot>
        <tr style="font-weight: bold; background: #f9f9f9;">
          <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">Net Pay:</td>
          <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">₹<span id="slip-total"></span></td>
        </tr>
      </tfoot>
    </table>
    
    <div style="margin-top: 64px; display: flex; justify-content: space-between;">
      <div style="border-top: 1px solid #333; padding-top: 8px;">Employer Signature</div>
      <div style="border-top: 1px solid #333; padding-top: 8px;">Employee Signature</div>
    </div>
  </div>
</body>`;

html = html.replace('</body>', modalHTML);

fs.writeFileSync('public/index.html', html);
console.log("HTML patched with Modals and Gradients!");

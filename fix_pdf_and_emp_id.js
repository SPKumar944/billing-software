const fs = require('fs');

// 1. Fix index.html (Employee ID field + Payslip Template)
let html = fs.readFileSync('public/index.html', 'utf8');

const empIdTarget = `<div class="form-group"><label>Employee ID</label><input type="text" id="edit_empid" readonly style="background:#f0f0f0;"></div>`;
const empIdReplace = `<div class="form-group" style="grid-column: 1 / -1;"><label style="font-size: 12px; color: #888;">Employee ID</label><input type="text" id="edit_empid" readonly style="background:#f2f2f7; border:none; border-radius:8px; padding:16px; font-size:24px; font-weight:600; color:#1c1c1e; width:100%; box-sizing:border-box; margin-top:4px;"></div>`;
html = html.replace(empIdTarget, empIdReplace);


const payslipTargetRegex = /<div id="payslip-template" style="display:none;[\s\S]*?<\/body>/;
const payslipReplace = `<div id="payslip-template" style="display:none; width: 700px; background: #ffffff; padding: 48px; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif; color: #1d1d1f; box-sizing: border-box;">
    
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #d2d2d7; padding-bottom: 24px; margin-bottom: 32px;">
      <div>
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Restaurant Name</h1>
        <div style="font-size: 14px; color: #86868b; font-weight: 600; margin-top: 4px; letter-spacing: 2px;">PAYSLIP</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 14px; color: #86868b;">Pay Period</div>
        <div style="font-size: 18px; font-weight: 600;" id="slip-month">Month 202X</div>
      </div>
    </div>
    
    <!-- Employee Info Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; font-size: 14px; line-height: 1.6;">
      <div>
        <div style="color: #86868b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Employee Details</div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">Name:</span> <strong id="slip-emp-name" style="font-weight:600;">Employee Name</strong></div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">Employee ID:</span> <strong id="slip-emp-id" style="font-weight:600;">EMP-000</strong></div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">Role:</span> <strong id="slip-emp-role" style="font-weight:600;">-</strong></div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">Department:</span> <strong id="slip-emp-dept" style="font-weight:600;">-</strong></div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">Date Joined:</span> <strong id="slip-emp-doj" style="font-weight:600;">-</strong></div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">UAN Number:</span> <strong id="slip-emp-uan" style="font-weight:600;">-</strong></div>
      </div>
      <div>
        <div style="color: #86868b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Banking Details</div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">Bank Name:</span> <strong id="slip-emp-bank" style="font-weight:600;">-</strong></div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">Account No:</span> <strong id="slip-emp-acc" style="font-weight:600;">-</strong></div>
        <div><span style="color:#86868b; display:inline-block; width:110px;">IFSC Code:</span> <strong id="slip-emp-ifsc" style="font-weight:600;">-</strong></div>
      </div>
    </div>
    
    <!-- Pay Table -->
    <div style="border-radius: 12px; border: 1px solid #d2d2d7; overflow: hidden; margin-bottom: 48px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <thead>
          <tr style="background: #f5f5f7;">
            <th style="padding: 16px 20px; text-align: left; font-weight: 600; color: #86868b; font-size: 13px; border-bottom: 1px solid #d2d2d7;">Description</th>
            <th style="padding: 16px 20px; text-align: right; font-weight: 600; color: #86868b; font-size: 13px; border-bottom: 1px solid #d2d2d7;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 20px; border-bottom: 1px solid #d2d2d7;">Basic Salary</td>
            <td style="padding: 20px; text-align: right; border-bottom: 1px solid #d2d2d7;">₹<span id="slip-amount">0</span></td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="background: #f5f5f7;">
            <td style="padding: 20px; text-align: right; font-weight: 600;">Net Pay</td>
            <td style="padding: 20px; text-align: right; font-weight: 700; font-size: 18px;">₹<span id="slip-total">0</span></td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <!-- Signatures -->
    <div style="display: flex; justify-content: space-between; margin-top: 80px;">
      <div style="width: 200px; border-top: 1px solid #d2d2d7; padding-top: 12px; font-size: 13px; color: #86868b; text-align: center;">Employer Signature</div>
      <div style="width: 200px; border-top: 1px solid #d2d2d7; padding-top: 12px; font-size: 13px; color: #86868b; text-align: center;">Employee Signature</div>
    </div>
    
  </div>
</body>`;

html = html.replace(payslipTargetRegex, payslipReplace);
fs.writeFileSync('public/index.html', html);


// 2. Fix script.js (Map new fields in downloadPayslip)
let script = fs.readFileSync('public/script.js', 'utf8');

const scriptTarget = `  document.getElementById('slip-emp-name').textContent = document.getElementById('edit_name').value || "Employee";
  document.getElementById('slip-emp-id').textContent = document.getElementById('edit_empid').value || "EMP-000";
  document.getElementById('slip-emp-dept').textContent = document.getElementById('edit_department').value || "Staff";
  
  document.getElementById('slip-month').textContent = month;`;
  
const scriptReplace = `  document.getElementById('slip-emp-name').textContent = document.getElementById('edit_name').value || "Employee";
  document.getElementById('slip-emp-id').textContent = document.getElementById('edit_empid').value || "EMP-000";
  document.getElementById('slip-emp-dept').textContent = document.getElementById('edit_department').value || "Staff";
  
  // New Apple-style fields
  document.getElementById('slip-emp-role').textContent = document.getElementById('edit_role').value || "-";
  document.getElementById('slip-emp-doj').textContent = document.getElementById('edit_doj').value || "-";
  document.getElementById('slip-emp-uan').textContent = document.getElementById('edit_uan').value || "-";
  document.getElementById('slip-emp-bank').textContent = document.getElementById('edit_bank_name').value || "-";
  document.getElementById('slip-emp-acc').textContent = document.getElementById('edit_bank_acc').value || "-";
  document.getElementById('slip-emp-ifsc').textContent = document.getElementById('edit_bank_ifsc').value || "-";
  
  document.getElementById('slip-month').textContent = month;`;

script = script.replace(scriptTarget, scriptReplace);
fs.writeFileSync('public/script.js', script);

console.log("Patched UI and Script!");

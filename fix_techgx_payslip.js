const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const oldPayslipRegex = /<div id="payslip-template"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newPayslip = `<div id="payslip-template" style="display:none; width: 800px; background: #ffffff; padding: 40px; font-family: Arial, sans-serif; color: #000; box-sizing: border-box; font-size: 13px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="margin: 0; font-size: 18px; font-weight: bold;">RESTAURANT SOLUTIONS PRIVATE LIMITED</h2>
      <div style="font-size: 12px; margin-top: 4px;">Flat No. 5, Food Complex, Bangalore, Karnataka</div>
      <div style="font-size: 12px;">E-Mail : hr@restaurant.com</div>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
      <div style="color: red; font-size: 14px;">Private and Confidential</div>
      <div style="text-align: center; flex: 1;">
        <h3 style="margin: 0; font-size: 16px; font-weight: bold;">Pay Slip</h3>
        <div style="font-weight: bold; font-size: 14px;">for <span id="slip-month">July-2026</span></div>
      </div>
      <div style="width: 150px;"></div>
    </div>
    
    <div style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 15px;" id="slip-emp-name">Employee Name</div>
    
    <!-- Employee Details Grid -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
      <tr>
        <td style="padding: 2px 0; width: 140px;">Employee Number</td><td style="padding: 2px 0; width: 10px;">:</td><td style="padding: 2px 0;" id="slip-emp-id">0004</td>
        <td style="padding: 2px 0; width: 180px;">Tax Regime</td><td style="padding: 2px 0; width: 10px;">:</td><td style="padding: 2px 0;">Regular Tax Regime</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Function</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;" id="slip-emp-dept">Kitchen</td>
        <td style="padding: 2px 0;">Income Tax Number (PAN)</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;">-</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Designation</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;" id="slip-emp-role">Chef</td>
        <td style="padding: 2px 0;">Universal Account Number (UAN)</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;" id="slip-emp-uan">-</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Location</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;">Bangalore</td>
        <td style="padding: 2px 0;">PF account number</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;">-</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Bank Details</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;"><span id="slip-emp-acc"></span>, <span id="slip-emp-bank"></span>, <span id="slip-emp-ifsc"></span></td>
        <td style="padding: 2px 0;">ESI Number</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;">-</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">Date of joining</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;" id="slip-emp-doj">18-Jul-24</td>
        <td style="padding: 2px 0;">PR Account Number (PRAN)</td><td style="padding: 2px 0;">:</td><td style="padding: 2px 0;">-</td>
      </tr>
    </table>
    
    <!-- Salary Table -->
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 12px; margin-bottom: 20px;">
      <thead>
        <tr style="border-bottom: 1px solid #000;">
          <th style="padding: 4px; text-align: left; border-right: 1px solid #000; width: 35%;">Earnings</th>
          <th style="padding: 4px; text-align: right; border-right: 1px solid #000; width: 15%;">Amount</th>
          <th style="padding: 4px; text-align: left; border-right: 1px solid #000; width: 35%;">Deductions</th>
          <th style="padding: 4px; text-align: right; width: 15%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 4px; border-right: 1px solid #000;">Basic Salary</td>
          <td style="padding: 4px; text-align: right; border-right: 1px solid #000;" id="slip-base">23,532.00</td>
          <td style="padding: 4px; border-right: 1px solid #000;">Professional Tax</td>
          <td style="padding: 4px; text-align: right;">200.00</td>
        </tr>
        <tr>
          <td style="padding: 4px; border-right: 1px solid #000;">House Rent Allowance</td>
          <td style="padding: 4px; text-align: right; border-right: 1px solid #000;">-</td>
          <td style="padding: 4px; border-right: 1px solid #000;" id="slip-leave-desc">Leave LOP (0 Days)</td>
          <td style="padding: 4px; text-align: right;" id="slip-leave-amt">0.00</td>
        </tr>
        <tr>
          <td style="padding: 4px; border-right: 1px solid #000;">Conveyance</td>
          <td style="padding: 4px; text-align: right; border-right: 1px solid #000;">-</td>
          <td style="padding: 4px; border-right: 1px solid #000;"></td>
          <td style="padding: 4px; text-align: right;"></td>
        </tr>
        <tr>
          <td style="padding: 4px; border-right: 1px solid #000;">Medical Allowance</td>
          <td style="padding: 4px; text-align: right; border-right: 1px solid #000;">-</td>
          <td style="padding: 4px; border-right: 1px solid #000;"></td>
          <td style="padding: 4px; text-align: right;"></td>
        </tr>
        <tr style="border-top: 1px solid #000; font-weight: bold;">
          <td style="padding: 4px; border-right: 1px solid #000;">Total Earnings</td>
          <td style="padding: 4px; text-align: right; border-right: 1px solid #000;" id="slip-total-earn">33,870.00</td>
          <td style="padding: 4px; border-right: 1px solid #000;">Total Deductions</td>
          <td style="padding: 4px; text-align: right;" id="slip-total-ded">200.00</td>
        </tr>
        <tr style="border-top: 1px solid #000; font-weight: bold;">
          <td style="padding: 4px; border-right: 1px solid #000;" colspan="2"></td>
          <td style="padding: 4px; border-right: 1px solid #000;">Net Amount</td>
          <td style="padding: 4px; text-align: right;">₹ <span id="slip-net">33,670.00</span></td>
        </tr>
      </tbody>
    </table>
    
    <div style="font-size: 12px; margin-bottom: 40px;">
      Amount (in words): <br>
      <strong id="slip-words">INR Thirty Three Thousand Six Hundred Seventy Only</strong>
    </div>
    
    <!-- Signatures -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="font-size: 12px; font-weight: bold;">for RESTAURANT SOLUTIONS PRIVATE LIMITED</div>
      </div>
      <div style="text-align: right; padding-right: 20px;">
        <div style="font-size: 12px; margin-bottom: 30px;">Authorised Signatory</div>
        <div style="font-size: 14px; font-weight: bold;">Manager</div>
        <div style="font-size: 12px;">Account Executive</div>
      </div>
    </div>
    
  </div>`;

html = html.replace(oldPayslipRegex, newPayslip);
fs.writeFileSync('public/index.html', html);


let script = fs.readFileSync('public/script.js', 'utf8');

// Update generatePayHistory to pass extra arguments to downloadPayslip
const genTarget = '<td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip(\'${monthLabel}\', ${Math.round(netPay)})">Download</button></td>';
const genReplace = '<td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip(\'${monthLabel}\', ${baseSalary}, ${absentCount}, ${Math.round(perDaySalary*absentCount)}, ${Math.round(netPay)})">Download</button></td>';
script = script.replace(genTarget, genReplace);

// We also need to fix the manual add button to match the new signature (just passing 0s)
const addTarget = '<td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip(\'${month}\', ${amount})">Download</button></td>';
const addReplace = '<td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip(\'${month}\', ${amount}, 0, 0, ${amount})">Download</button></td>';
script = script.replace(addTarget, addReplace);

// Rewrite downloadPayslip
const dlRegex = /window\.downloadPayslip = function[\s\S]*?\}\;/;
const dlReplace = `window.downloadPayslip = function(month, baseSalary, absentDays, leaveDeduction, netPay) {
  // Number to Words function (Basic for demo)
  const numToWords = (num) => {
    return "INR " + num.toString() + " Only"; // Placeholder, real impl can be added if needed
  };

  document.getElementById('slip-emp-name').textContent = document.getElementById('edit_name').value || "Employee";
  document.getElementById('slip-emp-id').textContent = document.getElementById('edit_empid').value || "EMP-000";
  document.getElementById('slip-emp-dept').textContent = document.getElementById('edit_department').value || "Staff";
  document.getElementById('slip-emp-role').textContent = document.getElementById('edit_role').value || "-";
  document.getElementById('slip-emp-doj').textContent = document.getElementById('edit_doj').value || "-";
  document.getElementById('slip-emp-uan').textContent = document.getElementById('edit_uan').value || "-";
  document.getElementById('slip-emp-bank').textContent = document.getElementById('edit_bank_name').value || "-";
  document.getElementById('slip-emp-acc').textContent = document.getElementById('edit_bank_acc').value || "-";
  document.getElementById('slip-emp-ifsc').textContent = document.getElementById('edit_bank_ifsc').value || "-";
  
  document.getElementById('slip-month').textContent = month;
  
  // Format numbers
  const fmt = (n) => parseInt(n).toLocaleString('en-IN') + ".00";
  
  // Mathematical values
  const profTax = 200;
  const totalEarnings = parseInt(baseSalary);
  const totalDeductions = profTax + parseInt(leaveDeduction);
  let finalNet = totalEarnings - totalDeductions;
  if(finalNet < 0) finalNet = 0;
  
  document.getElementById('slip-base').textContent = fmt(baseSalary);
  
  document.getElementById('slip-leave-desc').textContent = \`Leave LOP (\${absentDays} Days)\`;
  document.getElementById('slip-leave-amt').textContent = fmt(leaveDeduction);
  
  document.getElementById('slip-total-earn').textContent = fmt(totalEarnings);
  document.getElementById('slip-total-ded').textContent = fmt(totalDeductions);
  document.getElementById('slip-net').textContent = fmt(finalNet);
  
  document.getElementById('slip-words').textContent = numToWords(finalNet);
  
  const element = document.getElementById('payslip-template');
  element.style.display = 'block';
  
  const opt = {
    margin:       0.3,
    filename:     \`Payslip_\${month.replace(/ /g, '_')}.pdf\`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    element.style.display = 'none';
  });
};`;

script = script.replace(dlRegex, dlReplace);

fs.writeFileSync('public/script.js', script);
console.log("Rewrote TechGX payslip format!");

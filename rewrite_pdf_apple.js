const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const regex = /<div id="payslip-template"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newTemplate = `<div id="payslip-template" style="display:none; width: 700px; background: #ffffff; padding: 40px 50px; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif; color: #1d1d1f; box-sizing: border-box; font-size: 13px; line-height: 1.5; margin: 0 auto;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; color: #1d1d1f;">RESTAURANT SOLUTIONS</h2>
      <div style="font-size: 12px; color: #86868b;">Flat No. 5, Food Complex, Bangalore, Karnataka</div>
      <div style="font-size: 12px; color: #86868b;">hr@restaurant.com</div>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #d2d2d7; padding-bottom: 20px; margin-bottom: 30px;">
      <div>
        <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: #1d1d1f;">Payslip</h3>
        <div style="font-size: 14px; color: #86868b;">for <span id="slip-month">August 2026</span></div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #d9363e; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Private & Confidential</div>
        <div style="font-size: 16px; font-weight: 600; color: #1d1d1f;" id="slip-emp-name">Employee Name</div>
      </div>
    </div>
    
    <!-- Employee Details Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; font-size: 12px;">
      
      <!-- Left Column -->
      <div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">Employee Number</div>
          <div style="font-weight: 500; color: #1d1d1f;" id="slip-emp-id">0004</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">Function</div>
          <div style="font-weight: 500; color: #1d1d1f;" id="slip-emp-dept">Kitchen</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">Designation</div>
          <div style="font-weight: 500; color: #1d1d1f;" id="slip-emp-role">Chef</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">Location</div>
          <div style="font-weight: 500; color: #1d1d1f;">Bangalore</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">Bank Details</div>
          <div style="font-weight: 500; color: #1d1d1f;"><span id="slip-emp-acc"></span>, <span id="slip-emp-bank"></span>, <span id="slip-emp-ifsc"></span></div>
        </div>
        <div style="display: flex;">
          <div style="width: 140px; color: #86868b;">Date of joining</div>
          <div style="font-weight: 500; color: #1d1d1f;" id="slip-emp-doj">18-Jul-24</div>
        </div>
      </div>
      
      <!-- Right Column -->
      <div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">Tax Regime</div>
          <div style="font-weight: 500; color: #1d1d1f;">Regular Tax Regime</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">PAN</div>
          <div style="font-weight: 500; color: #1d1d1f;">-</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">UAN</div>
          <div style="font-weight: 500; color: #1d1d1f;" id="slip-emp-uan">-</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">PF Account</div>
          <div style="font-weight: 500; color: #1d1d1f;">-</div>
        </div>
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 140px; color: #86868b;">ESI Number</div>
          <div style="font-weight: 500; color: #1d1d1f;">-</div>
        </div>
        <div style="display: flex;">
          <div style="width: 140px; color: #86868b;">PRAN</div>
          <div style="font-weight: 500; color: #1d1d1f;">-</div>
        </div>
      </div>
      
    </div>
    
    <!-- Apple Style Table (No vertical borders, faint horizontal lines) -->
    <div style="border-radius: 12px; border: 1px solid #d2d2d7; overflow: hidden; margin-bottom: 30px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background: #f5f5f7; border-bottom: 1px solid #d2d2d7;">
            <th style="padding: 12px 20px; text-align: left; font-weight: 600; color: #86868b; width: 35%;">Earnings</th>
            <th style="padding: 12px 20px; text-align: right; font-weight: 600; color: #86868b; width: 15%; border-right: 1px solid #d2d2d7;">Amount</th>
            <th style="padding: 12px 20px; text-align: left; font-weight: 600; color: #86868b; width: 35%;">Deductions</th>
            <th style="padding: 12px 20px; text-align: right; font-weight: 600; color: #86868b; width: 15%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e5ea;">
            <td style="padding: 14px 20px;">Basic Salary</td>
            <td style="padding: 14px 20px; text-align: right; border-right: 1px solid #e5e5ea;" id="slip-base">23,532.00</td>
            <td style="padding: 14px 20px;">Professional Tax</td>
            <td style="padding: 14px 20px; text-align: right;">200.00</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e5ea;">
            <td style="padding: 14px 20px;">House Rent Allowance</td>
            <td style="padding: 14px 20px; text-align: right; border-right: 1px solid #e5e5ea;">-</td>
            <td style="padding: 14px 20px;" id="slip-leave-desc">Leave LOP (0 Days)</td>
            <td style="padding: 14px 20px; text-align: right; color: #d9363e;" id="slip-leave-amt">0.00</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e5ea;">
            <td style="padding: 14px 20px;">Conveyance</td>
            <td style="padding: 14px 20px; text-align: right; border-right: 1px solid #e5e5ea;">-</td>
            <td style="padding: 14px 20px;"></td>
            <td style="padding: 14px 20px; text-align: right;"></td>
          </tr>
          <tr>
            <td style="padding: 14px 20px;">Medical Allowance</td>
            <td style="padding: 14px 20px; text-align: right; border-right: 1px solid #e5e5ea;">-</td>
            <td style="padding: 14px 20px;"></td>
            <td style="padding: 14px 20px; text-align: right;"></td>
          </tr>
        </tbody>
        <tfoot style="border-top: 1px solid #d2d2d7; background: #fbfbfd;">
          <tr>
            <td style="padding: 16px 20px; font-weight: 600; color: #1d1d1f;">Total Earnings</td>
            <td style="padding: 16px 20px; text-align: right; font-weight: 600; color: #1d1d1f; border-right: 1px solid #d2d2d7;" id="slip-total-earn">33,870.00</td>
            <td style="padding: 16px 20px; font-weight: 600; color: #1d1d1f;">Total Deductions</td>
            <td style="padding: 16px 20px; text-align: right; font-weight: 600; color: #1d1d1f;" id="slip-total-ded">200.00</td>
          </tr>
          <tr style="border-top: 1px solid #d2d2d7; background: #ffffff;">
            <td colspan="2" style="border-right: 1px solid #d2d2d7;"></td>
            <td style="padding: 20px; font-weight: 700; font-size: 15px; color: #1d1d1f;">Net Amount</td>
            <td style="padding: 20px; text-align: right; font-weight: 700; font-size: 16px; color: #1d1d1f;">₹ <span id="slip-net">33,670.00</span></td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div style="font-size: 12px; margin-bottom: 60px; color: #86868b;">
      Amount (in words): <br>
      <strong style="color: #1d1d1f; font-size: 13px;" id="slip-words">INR Thirty Three Thousand Six Hundred Seventy Only</strong>
    </div>
    
    <!-- Signatures -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e5e5ea; padding-top: 24px;">
      <div>
        <div style="font-size: 11px; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Issued By</div>
        <div style="font-size: 13px; font-weight: 600; color: #1d1d1f;">RESTAURANT SOLUTIONS PVT LTD</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Authorised Signatory</div>
        <div style="font-size: 14px; font-weight: 600; color: #1d1d1f;">Manager</div>
        <div style="font-size: 12px; color: #86868b;">Account Executive</div>
      </div>
    </div>
    
  </div>`;

html = html.replace(regex, newTemplate);
fs.writeFileSync('public/index.html', html);
console.log("Applied Apple Design successfully!");

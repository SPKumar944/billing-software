const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const appendScript = `
// --- PAY HISTORY FUNCTIONS ---
window.savePayRecord = function() {
  const month = document.getElementById('pay_month').value;
  const amount = document.getElementById('pay_amount').value;
  const status = document.getElementById('pay_status').value;
  
  if (!month || !amount) {
    alert("Please fill in month and amount");
    return;
  }
  
  const tbody = document.getElementById('pay-history-tbody');
  
  // Format amount with commas if possible, but keep it simple
  const formattedAmount = parseInt(amount).toLocaleString('en-IN');
  
  const statusBadge = status === 'Paid' 
    ? '<span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span>'
    : '<span style="background: #fff0e5; color: #e65c00; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Pending</span>';
  
  const tr = document.createElement('tr');
  tr.style.borderBottom = '1px solid #f5f5f7';
  tr.innerHTML = \`
    <td style="padding: 12px 0; color: #333;">\${month}</td>
    <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹\${formattedAmount}</td>
    <td style="padding: 12px 0; text-align: right;">\${statusBadge}</td>
    <td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip('\${month}', \${amount})">Download</button></td>
  \`;
  
  // Prepend to show newest first
  tbody.insertBefore(tr, tbody.firstChild);
  
  // Hide modal & reset
  document.getElementById('add-pay-modal').style.display = 'none';
  document.getElementById('pay_month').value = '';
  document.getElementById('pay_amount').value = '';
};

window.downloadPayslip = function(month, amount) {
  // Populate the hidden template
  document.getElementById('slip-emp-name').textContent = document.getElementById('edit_name').value || "Employee";
  document.getElementById('slip-emp-id').textContent = document.getElementById('edit_empid').value || "EMP-000";
  document.getElementById('slip-emp-dept').textContent = document.getElementById('edit_department').value || "Staff";
  
  document.getElementById('slip-month').textContent = month;
  
  const formattedAmount = parseInt(amount).toLocaleString('en-IN');
  document.getElementById('slip-amount').textContent = formattedAmount;
  document.getElementById('slip-total').textContent = formattedAmount;
  
  const element = document.getElementById('payslip-template');
  
  // Temporarily show it for html2pdf rendering
  element.style.display = 'block';
  
  const opt = {
    margin:       0.5,
    filename:     \`Payslip_\${month.replace(/ /g, '_')}.pdf\`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    // Hide it again
    element.style.display = 'none';
  });
};
`;

script += appendScript;
fs.writeFileSync('public/script.js', script);
console.log("Patched script with pay functions!");

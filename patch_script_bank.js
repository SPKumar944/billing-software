const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target1 = `  const emergencyRel = p['Emergency Relationship']?.rich_text[0]?.plain_text || '';`;
const replace1 = `  const emergencyRel = p['Emergency Relationship']?.rich_text[0]?.plain_text || '';
  const idType = p['ID Type']?.select?.name || '';
  const idNumber = p['ID Number']?.rich_text[0]?.plain_text || '';
  const bankName = p['Bank Name']?.rich_text[0]?.plain_text || '';
  const bankAcc = p['Account Number']?.rich_text[0]?.plain_text || '';
  const bankIfsc = p['IFSC Code']?.rich_text[0]?.plain_text || '';`;

script = script.replace(target1, replace1);

const target2 = `  document.getElementById('edit_current_address').value = currentAddress;
  document.getElementById('edit_perm_address').value = permAddress;`;
const replace2 = `  document.getElementById('edit_current_address').value = currentAddress;
  document.getElementById('edit_perm_address').value = permAddress;
  document.getElementById('edit_id_type').value = idType;
  document.getElementById('edit_id_number').value = idNumber;
  document.getElementById('edit_bank_name').value = bankName;
  document.getElementById('edit_bank_acc').value = bankAcc;
  document.getElementById('edit_bank_ifsc').value = bankIfsc;`;

script = script.replace(target2, replace2);

const target3 = `          currentAddress: document.getElementById('edit_current_address').value,
          permAddress: document.getElementById('edit_perm_address').value
        })`;
const replace3 = `          currentAddress: document.getElementById('edit_current_address').value,
          permAddress: document.getElementById('edit_perm_address').value,
          idType: document.getElementById('edit_id_type').value,
          idNumber: document.getElementById('edit_id_number').value,
          bankName: document.getElementById('edit_bank_name').value,
          bankAcc: document.getElementById('edit_bank_acc').value,
          bankIfsc: document.getElementById('edit_bank_ifsc').value
        })`;

script = script.replace(target3, replace3);

fs.writeFileSync('public/script.js', script);
console.log("Patched script.js with bank details!");

const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

// Update openProfile to populate the new inputs
const target1 = `  document.getElementById('edit_emp_id').value = pageId;
  document.getElementById('edit_name').value = name;
  document.getElementById('edit_role').value = role;
  document.getElementById('edit_blood').value = blood;
  document.getElementById('edit_empid').value = empId;
  document.getElementById('edit_mobile').value = mobile;
  document.getElementById('edit_email').value = email;`;

const replace1 = `  document.getElementById('edit_emp_id').value = pageId;
  document.getElementById('edit_name').value = name;
  document.getElementById('edit_role').value = role;
  document.getElementById('edit_blood').value = blood;
  document.getElementById('edit_empid').value = empId;
  document.getElementById('edit_mobile').value = mobile;
  document.getElementById('edit_email').value = email;
  
  document.getElementById('edit_doj').value = doj;
  document.getElementById('edit_dob').value = dob;
  document.getElementById('edit_father').value = father;
  document.getElementById('edit_marital').value = marital;
  document.getElementById('edit_uan').value = uan;
  
  document.getElementById('edit_emergency_name').value = emergencyName;
  document.getElementById('edit_emergency_phone').value = emergencyPhone;
  document.getElementById('edit_emergency_rel').value = emergencyRel;
  
  document.getElementById('edit_current_address').value = currentAddress;
  document.getElementById('edit_perm_address').value = permAddress;`;

script = script.replace(target1, replace1);

// Update submit handler to send the new inputs
const target2 = `        body: JSON.stringify({
          name: name,
          role: role,
          mobile: document.getElementById('edit_mobile').value,
          email: document.getElementById('edit_email').value,
          blood: blood
        })`;

const replace2 = `        body: JSON.stringify({
          name: name,
          role: role,
          mobile: document.getElementById('edit_mobile').value,
          email: document.getElementById('edit_email').value,
          blood: blood,
          doj: document.getElementById('edit_doj').value,
          dob: document.getElementById('edit_dob').value,
          father: document.getElementById('edit_father').value,
          marital: document.getElementById('edit_marital').value,
          uan: document.getElementById('edit_uan').value,
          emergencyName: document.getElementById('edit_emergency_name').value,
          emergencyPhone: document.getElementById('edit_emergency_phone').value,
          emergencyRel: document.getElementById('edit_emergency_rel').value,
          currentAddress: document.getElementById('edit_current_address').value,
          permAddress: document.getElementById('edit_perm_address').value
        })`;

script = script.replace(target2, replace2);

fs.writeFileSync('public/script.js', script);
console.log("Patched script.js for the edit form submission!");

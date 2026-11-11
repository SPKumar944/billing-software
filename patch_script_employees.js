const fs = require('fs');

let js = fs.readFileSync('public/script.js', 'utf8');

const employeeLogic = `
// --- Employee Onboarding ---
const onboardingForm = document.getElementById('onboarding-form');
if (onboardingForm) {
  onboardingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btn-submit-employee');
    btn.innerText = "Saving...";
    btn.disabled = true;

    try {
      const formData = new FormData();
      formData.append('name', document.getElementById('emp_name').value);
      formData.append('doj', document.getElementById('emp_doj').value);
      formData.append('role', document.getElementById('emp_role').value);
      formData.append('mobile', document.getElementById('emp_mobile').value);
      formData.append('emergencyName', document.getElementById('emp_emergency_name').value);
      formData.append('emergencyPhone', document.getElementById('emp_emergency_phone').value);
      formData.append('emergencyRel', document.getElementById('emp_emergency_rel').value);
      formData.append('idType', document.getElementById('emp_id_type').value);
      formData.append('idNumber', document.getElementById('emp_id_number').value);
      formData.append('bankName', document.getElementById('emp_bank_name').value);
      formData.append('bankAcc', document.getElementById('emp_bank_acc').value);
      formData.append('bankIfsc', document.getElementById('emp_bank_ifsc').value);

      const photoFile = document.getElementById('emp_photo').files[0];
      if (photoFile) formData.append('photo', photoFile);

      const idDocFile = document.getElementById('emp_id_doc').files[0];
      if (idDocFile) formData.append('idDoc', idDocFile);

      const addressDocFile = document.getElementById('emp_address_doc').files[0];
      if (addressDocFile) formData.append('addressDoc', addressDocFile);

      const res = await fetch('/api/employees', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      alert("Employee saved successfully!");
      onboardingForm.reset();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message + "\\n\\nDid you create the Notion Database and add its ID to server.js?");
    } finally {
      btn.innerText = "Save Employee Record";
      btn.disabled = false;
    }
  });
}
`;

js += "\n" + employeeLogic;
fs.writeFileSync('public/script.js', js);

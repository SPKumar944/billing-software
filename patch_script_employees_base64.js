const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

// Replace the previous formData logic with JSON + base64 logic
const newLogic = `
const onboardingForm = document.getElementById('onboarding-form');
if (onboardingForm) {
  onboardingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-employee');
    btn.innerText = "Saving...";
    btn.disabled = true;

    try {
      const getFileBase64 = (inputId) => {
        return new Promise((resolve) => {
          const file = document.getElementById(inputId).files[0];
          if (!file) return resolve(null);
          const reader = new FileReader();
          reader.onload = (e) => resolve({ name: file.name, data: e.target.result });
          reader.readAsDataURL(file);
        });
      };

      const payload = {
        name: document.getElementById('emp_name').value,
        doj: document.getElementById('emp_doj').value,
        role: document.getElementById('emp_role').value,
        mobile: document.getElementById('emp_mobile').value,
        emergencyName: document.getElementById('emp_emergency_name').value,
        emergencyPhone: document.getElementById('emp_emergency_phone').value,
        emergencyRel: document.getElementById('emp_emergency_rel').value,
        idType: document.getElementById('emp_id_type').value,
        idNumber: document.getElementById('emp_id_number').value,
        bankName: document.getElementById('emp_bank_name').value,
        bankAcc: document.getElementById('emp_bank_acc').value,
        bankIfsc: document.getElementById('emp_bank_ifsc').value,
        photo: await getFileBase64('emp_photo'),
        idDoc: await getFileBase64('emp_id_doc'),
        addressDoc: await getFileBase64('emp_address_doc')
      };

      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      alert("Employee saved successfully to Notion Database!");
      onboardingForm.reset();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      btn.innerText = "Save Employee Record";
      btn.disabled = false;
    }
  });
}
`;

js = js.replace(/\/\/ --- Employee Onboarding ---[\s\S]*?(?=$)/, '// --- Employee Onboarding ---' + newLogic);
fs.writeFileSync('public/script.js', js);

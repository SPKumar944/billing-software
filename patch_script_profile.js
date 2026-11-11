const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

const newGridLogic = `
        <button class="btn btn-secondary" onclick="openProfile('\${emp.id}', '\${name}', '\${role}', '\${blood}', '\${empIdStr}', '\${photoUrl}', '\${phone}', '\${p['Email Address']?.email || ''}')">View Profile</button>
`;
js = js.replace(/<button class="btn btn-secondary" onclick="showIDCard[^>]+>ID Card<\/button>/, newGridLogic);

const profileLogic = `
window.openProfile = function(pageId, name, role, blood, empId, photoUrl, mobile, email) {
  // Hide views
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('employee-profile-view').style.display = 'block';

  // Fill edit form
  document.getElementById('edit_emp_id').value = pageId;
  document.getElementById('edit_name').value = name;
  document.getElementById('edit_role').value = role;
  document.getElementById('edit_blood').value = blood;
  document.getElementById('edit_empid').value = empId;
  document.getElementById('edit_mobile').value = mobile;
  document.getElementById('edit_email').value = email;

  // Fill ID Card
  document.getElementById('profile-card-name').innerText = name;
  document.getElementById('profile-card-role').innerText = role;
  document.getElementById('profile-card-blood').innerText = blood;
  document.getElementById('profile-card-empid').innerText = empId;
  document.getElementById('profile-card-photo').src = photoUrl;
  
  const qrData = encodeURIComponent(\`ID:\${empId}|Name:\${name}|Blood:\${blood}|Role:\${role}\`);
  document.getElementById('profile-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${qrData}\`;
};

window.backToDirectory = function() {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('employee-directory-view').style.display = 'block';
};

window.downloadIDCard = function() {
  window.print();
};

const editForm = document.getElementById('edit-employee-form');
if (editForm) {
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pageId = document.getElementById('edit_emp_id').value;
    
    // Quick local update to ID Card to reflect changes instantly before save
    const name = document.getElementById('edit_name').value;
    const role = document.getElementById('edit_role').value;
    const blood = document.getElementById('edit_blood').value;
    document.getElementById('profile-card-name').innerText = name;
    document.getElementById('profile-card-role').innerText = role;
    document.getElementById('profile-card-blood').innerText = blood;
    
    const qrData = encodeURIComponent(\`ID:\${document.getElementById('edit_empid').value}|Name:\${name}|Blood:\${blood}|Role:\${role}\`);
    document.getElementById('profile-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${qrData}\`;

    try {
      const res = await fetch(\`/api/employees/\${pageId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          role: role,
          mobile: document.getElementById('edit_mobile').value,
          email: document.getElementById('edit_email').value,
          blood: blood
        })
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Employee details updated successfully!");
      loadEmployeeDirectory();
    } catch(err) {
      alert(err.message);
    }
  });
}
`;

js += "\n" + profileLogic;
fs.writeFileSync('public/script.js', js);

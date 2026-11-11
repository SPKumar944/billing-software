const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

const fetchLogic = `
window.loadEmployeeDirectory = async function() {
  const grid = document.getElementById('employee-grid');
  grid.innerHTML = '<p style="color:#888;">Fetching employees from Notion...</p>';
  try {
    const res = await fetch('/api/employees');
    const data = await res.json();
    grid.innerHTML = '';
    
    if (data.length === 0) {
      grid.innerHTML = '<p style="color:#888;">No employees found.</p>';
      return;
    }

    data.forEach(emp => {
      const p = emp.properties;
      const name = p.Name?.title[0]?.plain_text || 'Unknown';
      const role = p.Role?.select?.name || 'Staff';
      const blood = p['Blood Group']?.select?.name || '-';
      const empIdStr = p['Employee ID']?.rich_text[0]?.plain_text || 'EMP-XXXXXX';
      const phone = p.Mobile?.phone_number || '';
      
      const photoUrl = p.Photo?.files[0]?.external?.url || 'https://i.pravatar.cc/150?u=' + empIdStr;

      const card = document.createElement('div');
      card.style.cssText = 'background:#fff; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; align-items:center; gap:16px; border:1px solid #eee;';
      card.innerHTML = \`
        <img src="\${photoUrl}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #eee;">
        <div style="flex:1;">
          <h4 style="margin:0; font-size:16px; color:#333;">\${name}</h4>
          <p style="margin:2px 0 0 0; font-size:13px; color:#0071e3; font-weight:500;">\${role}</p>
          <p style="margin:4px 0 0 0; font-size:12px; color:#888;">\${empIdStr} • \${phone}</p>
        </div>
        <button class="btn btn-secondary" onclick="showIDCard('\${name}', '\${role}', '\${blood}', '\${empIdStr}', '\${photoUrl}')">ID Card</button>
      \`;
      grid.appendChild(card);
    });
  } catch(err) {
    grid.innerHTML = '<p style="color:red;">Failed to load.</p>';
  }
};

window.showIDCard = function(name, role, blood, empId, photoUrl) {
  document.getElementById('id-card-name').innerText = name;
  document.getElementById('id-card-role').innerText = role;
  document.getElementById('id-card-blood').innerText = blood;
  document.getElementById('id-card-empid').innerText = empId;
  document.getElementById('id-card-photo').src = photoUrl;
  
  const qrData = encodeURIComponent(\`ID:\${empId}|Name:\${name}|Blood:\${blood}|Role:\${role}\`);
  document.getElementById('id-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${qrData}\`;
  
  document.getElementById('id-card-modal').style.display = 'flex';
};

// Auto-load directory when tab is clicked
document.querySelector('[data-target="employee-directory-view"]').addEventListener('click', loadEmployeeDirectory);
`;

js += "\n" + fetchLogic;
fs.writeFileSync('public/script.js', js);

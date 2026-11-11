const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

const idCardLogic = `
      // Read the backend response which should now return the employee ID
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      // Populate ID Card Modal
      const empName = payload.name || "Unknown";
      const empRole = payload.role || "Employee";
      const empBlood = payload.blood || "-";
      const empIdStr = data.empId || "EMP-000000";

      document.getElementById('id-card-name').innerText = empName;
      document.getElementById('id-card-role').innerText = empRole;
      document.getElementById('id-card-blood').innerText = empBlood;
      document.getElementById('id-card-empid').innerText = empIdStr;
      
      // Use the base64 photo if available, else a placeholder will show
      if (payload.photo && payload.photo.data) {
        document.getElementById('id-card-photo').src = payload.photo.data;
      }
      
      // Generate QR Code with employee data
      const qrData = encodeURIComponent(\`ID:\${empIdStr}|Name:\${empName}|Blood:\${empBlood}|Role:\${empRole}\`);
      document.getElementById('id-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${qrData}\`;

      // Show Modal
      document.getElementById('id-card-modal').style.display = 'flex';

      onboardingForm.reset();
`;

// Replace the existing success alert block
js = js.replace(/const data = await res\.json\(\);\s*if \(\!res\.ok\) throw new Error\(data\.error \|\| 'Failed to save'\);\s*alert\("Employee saved successfully to Notion Database!"\);\s*onboardingForm\.reset\(\);/, idCardLogic);

fs.writeFileSync('public/script.js', js);

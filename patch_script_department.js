const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

// 1. Onboarding Form Submission
const onboardTarget = `        role: document.getElementById('emp_role').value,`;
const onboardReplace = `        role: document.getElementById('emp_role').value,
        department: document.getElementById('emp_department').value,`;
script = script.replace(onboardTarget, onboardReplace);

// 2. loadEmployeeDirectory Grouping
const loadDirTarget = `    data.forEach(emp => {
      const p = emp.properties;
      const name = p.Name?.title[0]?.plain_text || 'Unknown';
      const role = p.Role?.select?.name || 'Staff';`;
const loadDirReplace = `    // Group by department
    const grouped = data.reduce((acc, emp) => {
      const dept = emp.properties.Department?.select?.name || 'Unassigned';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(emp);
      return acc;
    }, {});
    
    // Sort departments so Unassigned is last
    const depts = Object.keys(grouped).sort((a, b) => a === 'Unassigned' ? 1 : b === 'Unassigned' ? -1 : a.localeCompare(b));
    
    depts.forEach(dept => {
      const deptSection = document.createElement('div');
      deptSection.style.cssText = 'grid-column: 1 / -1; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 8px;';
      deptSection.innerHTML = \`<h3 style="margin:0; font-size:16px; color:#555; text-transform:uppercase; letter-spacing:0.05em;">\${dept}</h3>\`;
      grid.appendChild(deptSection);
      
      grouped[dept].forEach(emp => {
        const p = emp.properties;
        const name = p.Name?.title[0]?.plain_text || 'Unknown';
        const role = p.Role?.select?.name || 'Staff';`;
script = script.replace(loadDirTarget, loadDirReplace);

// Need to close the grouped[dept].forEach loop
const loadDirEndTarget = `      grid.appendChild(card);
    });
  } catch(err) {`;
const loadDirEndReplace = `      grid.appendChild(card);
      });
    });
  } catch(err) {`;
script = script.replace(loadDirEndTarget, loadDirEndReplace);

// 3. openProfile Population
const openProfTarget = `  const name = p.Name?.title[0]?.plain_text || '';
  const role = p.Role?.select?.name || '';`;
const openProfReplace = `  const name = p.Name?.title[0]?.plain_text || '';
  const role = p.Role?.select?.name || '';
  const department = p.Department?.select?.name || 'Unassigned';`;
script = script.replace(openProfTarget, openProfReplace);

const openProfUITarget = `  document.getElementById('edit_name').value = name;
  document.getElementById('edit_role').value = role;`;
const openProfUIReplace = `  document.getElementById('edit_name').value = name;
  document.getElementById('edit_role').value = role;
  document.getElementById('edit_department').value = department;
  document.getElementById('profile-card-department').innerText = department;`;
script = script.replace(openProfUITarget, openProfUIReplace);

// 4. Edit Form Submission
const editFormTarget = `          name: name,
          role: role,`;
const editFormReplace = `          name: name,
          role: role,
          department: document.getElementById('edit_department').value,`;
script = script.replace(editFormTarget, editFormReplace);

const editFormUITarget = `    document.getElementById('profile-card-role').innerText = role;`;
const editFormUIReplace = `    document.getElementById('profile-card-role').innerText = role;
    document.getElementById('profile-card-department').innerText = document.getElementById('edit_department').value;`;
script = script.replace(editFormUITarget, editFormUIReplace);

// 5. Preview ID Card (from onboarding)
const previewTarget = `window.showIDCard = function(name, role, blood, empId, photoUrl) {
  document.getElementById('id-card-name').innerText = name;
  document.getElementById('id-card-role').innerText = role;`;
const previewReplace = `window.showIDCard = function(name, role, blood, empId, photoUrl) {
  document.getElementById('id-card-name').innerText = name;
  document.getElementById('id-card-role').innerText = role;
  document.getElementById('id-card-department').innerText = document.getElementById('emp_department')?.value || 'Unassigned';`;
script = script.replace(previewTarget, previewReplace);

fs.writeFileSync('public/script.js', script);
console.log("Patched script.js with Department functionality!");

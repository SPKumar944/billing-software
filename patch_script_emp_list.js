const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target1 = `    data.forEach(emp => {`;
const replace1 = `    window.employeeList = data;
    data.forEach(emp => {`;
script = script.replace(target1, replace1);

const target2 = `onclick="openProfile('\\$\\{emp.id\\}', '\\$\\{name\\}', '\\$\\{role\\}', '\\$\\{blood\\}', '\\$\\{empIdStr\\}', '\\$\\{photoUrl\\}', '\\$\\{phone\\}', '\\$\\{p['Email Address']?.email || ''\\}')">View Profile</button>`;
const replace2 = `onclick="openProfile('\\$\\{emp.id\\}')">View Profile</button>`;

// Replace regex style to avoid escaping hell
script = script.replace(/onclick="openProfile[^>]+>View Profile<\/button>/, `onclick="openProfile('\\$\\{emp.id\\}')">View Profile</button>`);

const target3 = `window.openProfile = function(pageId, name, role, blood, empId, photoUrl, mobile, email) {
  // Hide views`;
const replace3 = `window.openProfile = function(pageId) {
  const emp = window.employeeList.find(e => e.id === pageId);
  if (!emp) return;
  const p = emp.properties;
  
  const name = p.Name?.title[0]?.plain_text || '';
  const role = p.Role?.select?.name || '';
  const blood = p['Blood Group']?.select?.name || '';
  const empId = p['Employee ID']?.rich_text[0]?.plain_text || '';
  const mobile = p.Mobile?.phone_number || '';
  const email = p['Email Address']?.email || '';
  const photoUrl = p.Photo?.files[0]?.external?.url || 'https://i.pravatar.cc/150?u=' + empId;

  const doj = p['Date of Joining']?.date?.start || '';
  const dob = p['Date of Birth']?.date?.start || '';
  const father = p['Father/Spouse Name']?.rich_text[0]?.plain_text || '';
  const marital = p['Marital Status']?.select?.name || '';
  const currentAddress = p['Current Address']?.rich_text[0]?.plain_text || '';
  const permAddress = p['Permanent Address']?.rich_text[0]?.plain_text || '';
  const uan = p['UAN Number']?.rich_text[0]?.plain_text || '';
  const emergencyName = p['Emergency Contact']?.rich_text[0]?.plain_text || '';
  const emergencyPhone = p['Emergency Phone']?.phone_number || '';
  const emergencyRel = p['Emergency Relationship']?.rich_text[0]?.plain_text || '';
  
  // Hide views`;
script = script.replace(target3, replace3);

fs.writeFileSync('public/script.js', script);
console.log("Patched script.js for openProfile signature!");

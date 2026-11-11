const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// We want to target only the grids inside the edit form
const formStart = html.indexOf('<form id="edit-employee-form">');
const formEnd = html.indexOf('</form>', formStart);

if (formStart !== -1 && formEnd !== -1) {
  let formStr = html.substring(formStart, formEnd);
  
  // Replace 1fr with 1fr 1fr
  formStr = formStr.replace(/grid-template-columns:\s*1fr;/g, 'grid-template-columns: 1fr 1fr;');
  
  html = html.substring(0, formStart) + formStr + html.substring(formEnd);
  fs.writeFileSync('public/index.html', html);
  console.log("Updated to two columns!");
} else {
  console.log("Could not find form");
}

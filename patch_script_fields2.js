const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

const target = "bankIfsc: document.getElementById('emp_bank_ifsc').value,";
const fieldsRepl = target + `
        dob: document.getElementById('emp_dob').value,
        blood: document.getElementById('emp_blood').value,
        father: document.getElementById('emp_father').value,
        marital: document.getElementById('emp_marital').value,
        currentAddress: document.getElementById('emp_current_address').value,
        permAddress: document.getElementById('emp_perm_address').value,
        uan: document.getElementById('emp_uan').value,
        email: document.getElementById('emp_email').value,
`;

js = js.replace(target, fieldsRepl);
fs.writeFileSync('public/script.js', js);

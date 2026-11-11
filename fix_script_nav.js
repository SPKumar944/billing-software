const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const navTarget = `      if (target === 'employee-directory-view') {
        loadEmployeeDirectory();
      }`;

const navReplace = `      if (target === 'employee-directory-view' || target === 'attendance-view') {
        loadEmployeeDirectory();
      }`;

script = script.replace(navTarget, navReplace);
fs.writeFileSync('public/script.js', script);
console.log("Fixed script nav listener!");

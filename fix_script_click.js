const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

// The file literally contains: onclick="openProfile('\$\{emp.id\}')"
script = script.replace("onclick=\"openProfile('\\$\\{emp.id\\}')\"", "onclick=\"openProfile('${emp.id}')\"");

fs.writeFileSync('public/script.js', script);
console.log("Fixed openProfile call using string replace!");

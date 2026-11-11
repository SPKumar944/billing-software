const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

script = script.replace(/format: 'letter'/g, "format: 'a4'");

fs.writeFileSync('public/script.js', script);
console.log("Changed PDF format to A4!");

const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

js = js.replace(/grid\.innerHTML = '<p style="color:red;">Failed to load\.<\/p>';/, "grid.innerHTML = '<p style=\"color:red;\">' + err.message + '</p>'; console.error(err);");

fs.writeFileSync('public/script.js', js);

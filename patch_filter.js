const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

js = js.replace(/itemsData = itemsData\.sort\(\(a, b\) => a\.name\.localeCompare\(b\.name\)\);/g, 
"itemsData = itemsData.filter(i => !i.name.includes('SYSTEM_')).sort((a, b) => a.name.localeCompare(b.name));");

fs.writeFileSync('public/script.js', js);

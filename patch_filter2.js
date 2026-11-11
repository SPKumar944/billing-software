const fs = require('fs');
let js = fs.readFileSync('public/script.js', 'utf8');

js = js.replace(/itemsData = data\.items\.map\(/g, "itemsData = data.items.filter(p => {\n      const nameProp = p.properties.Item_Name || p.properties.Name || p.properties.title;\n      const name = nameProp?.title?.[0]?.plain_text || '';\n      return !name.includes('SYSTEM_');\n    }).map(");

fs.writeFileSync('public/script.js', js);

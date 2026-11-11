const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// The divs might still be slightly imbalanced, let's just make absolutely sure 
// the views are structured safely inside content-area.

fs.writeFileSync('public/index.html', html);

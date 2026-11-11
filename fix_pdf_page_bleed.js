const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// The main container padding
html = html.replace(/padding: 40px 50px;/g, 'padding: 20px 40px;');

// Header margin-bottom
html = html.replace(/margin-bottom: 40px;/g, 'margin-bottom: 20px;');

// Title margin-bottom
html = html.replace(/margin-bottom: 30px;/g, 'margin-bottom: 15px;');

// Employee Details Grid
// The grid has gap: 24px and margin-bottom: 40px. (But wait, I already replaced 40px with 20px above!)
html = html.replace(/gap: 24px;/g, 'gap: 16px;');
html = html.replace(/margin-bottom: 8px;/g, 'margin-bottom: 4px;'); // Tighten the rows

// Table margin-bottom was 30px, changed to 15px above.
html = html.replace(/padding: 14px 20px;/g, 'padding: 10px 20px;'); // Shrink table cell padding

// Amount in words margin-bottom was 60px.
html = html.replace(/margin-bottom: 60px;/g, 'margin-bottom: 30px;');

fs.writeFileSync('public/index.html', html);
console.log("Shrunk vertical spacing in PDF template!");

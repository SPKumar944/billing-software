const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// I need to add a </div> right before: <h3 ...>3. Emergency Contact</h3>
html = html.replace(
  /<h3 style="[^"]*">3\. Emergency Contact<\/h3>/, 
  "</div>\n\n            <h3 style=\"margin-top:0; font-size:15px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;\">3. Emergency Contact</h3>"
);

fs.writeFileSync('public/index.html', html);
console.log("Fixed missing div in onboarding form!");

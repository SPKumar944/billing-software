const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Change parent grid to center the content and limit the form width
const parentGridTarget = `<div style="display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start;">`;
const parentGridReplace = `<div style="display: flex; gap: 32px; align-items: flex-start; max-width: 900px; margin: 0 auto;">`;
html = html.replace(parentGridTarget, parentGridReplace);

// 2. Make the edit form take flex: 1 but cap its width, and change internal grids to 1fr
const formContainerTarget = `<div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">`;
const formContainerReplace = `<div style="background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); flex: 1; min-width: 400px;">`;
html = html.replace(formContainerTarget, formContainerReplace);

// 3. Change all 1fr 1fr grids inside the edit form to 1fr
html = html.replace(/<div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">/g, '<div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">');

fs.writeFileSync('public/index.html', html);
console.log("Fixed profile layout!");

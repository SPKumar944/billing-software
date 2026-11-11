const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const previewBtn = `
              <button type="button" class="btn btn-secondary" onclick="previewSampleID()">Preview Sample ID</button>
              <button type="reset" class="btn btn-secondary">Clear Form</button>
`;

html = html.replace(/<button type="reset" class="btn btn-secondary">Clear Form<\/button>/, previewBtn);
fs.writeFileSync('public/index.html', html);

let js = fs.readFileSync('public/script.js', 'utf8');
const previewLogic = `
window.previewSampleID = function() {
  document.getElementById('id-card-name').innerText = "Rahul Sharma";
  document.getElementById('id-card-role').innerText = "Store Manager";
  document.getElementById('id-card-blood').innerText = "O+";
  document.getElementById('id-card-empid').innerText = "EMP-654321";
  document.getElementById('id-card-photo').src = "https://i.pravatar.cc/150?img=11";
  
  const qrData = encodeURIComponent("ID:EMP-654321|Name:Rahul Sharma|Blood:O+|Role:Store Manager");
  document.getElementById('id-card-qr').src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${qrData}\`;

  document.getElementById('id-card-modal').style.display = 'flex';
};
`;

js += "\n" + previewLogic;
fs.writeFileSync('public/script.js', js);

const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const idCardModal = `
  <!-- ID Card Modal -->
  <div class="modal-overlay" id="id-card-modal" style="display: none; align-items:center; justify-content:center; z-index:9999;">
    <div style="background:#fff; border-radius:16px; padding:32px; width:400px; box-shadow:0 10px 30px rgba(0,0,0,0.1); position:relative;">
      <button type="button" onclick="document.getElementById('id-card-modal').style.display='none'" style="position:absolute; right:16px; top:16px; background:none; border:none; font-size:24px; cursor:pointer; color:#888;">&times;</button>
      
      <div style="text-align:center; margin-bottom: 24px;">
        <h2 style="margin:0; color:#333; font-size:20px;">Employee ID Card</h2>
        <p style="color:#888; font-size:14px; margin-top:4px;">Generated Successfully</p>
      </div>

      <div id="print-id-area" style="width: 250px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); font-family: -apple-system, sans-serif;">
        <div style="background: var(--primary-color); color: #fff; text-align: center; padding: 16px 0; font-weight: bold; font-size: 16px; letter-spacing: 0.05em; text-transform: uppercase;">
          STAFF ID
        </div>
        <div style="padding: 24px 16px; text-align: center;">
          <div style="width: 80px; height: 80px; margin: 0 auto 16px auto; border-radius: 50%; overflow: hidden; border: 3px solid #eee;">
            <img id="id-card-photo" src="" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23ccc\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'">
          </div>
          <h3 id="id-card-name" style="margin:0; font-size:18px; color:#333;">John Doe</h3>
          <p id="id-card-role" style="margin: 4px 0 16px 0; color:#0071e3; font-weight:600; font-size:13px; text-transform:uppercase;">Store Manager</p>
          
          <div style="display:flex; justify-content:space-between; text-align:left; font-size:11px; color:#555; margin-bottom:16px; background:#f9f9f9; padding:8px; border-radius:6px;">
            <div>
              <span style="display:block; color:#888; font-size:9px; text-transform:uppercase;">Emp ID</span>
              <strong id="id-card-empid">EMP-123456</strong>
            </div>
            <div style="text-align:right;">
              <span style="display:block; color:#888; font-size:9px; text-transform:uppercase;">Blood</span>
              <strong id="id-card-blood">O+</strong>
            </div>
          </div>
          
          <div style="margin-top: 16px;">
            <img id="id-card-qr" src="" style="width:70px; height:70px; display:block; margin:0 auto;">
          </div>
        </div>
        <div style="background: #f5f5f7; padding: 10px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee;">
          Property of Restaurant
        </div>
      </div>
      
      <div style="margin-top:24px; text-align:center;">
        <button type="button" class="btn btn-primary" style="width:100%;" onclick="window.print()">Print ID Card</button>
      </div>
    </div>
  </div>
  <!-- End ID Card Modal -->
`;

// Insert the modal at the very end of the body, before scripts
html = html.replace(/<script src="script\.js\?v=999"><\/script>/, idCardModal + '\n\n  <script src="script.js?v=999"></script>');
fs.writeFileSync('public/index.html', html);

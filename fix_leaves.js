const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const leaveTarget = `              <!-- Leave Balances -->
              <div>
                <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.05em;">Leave Balances</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                  
                  <!-- Sick Leave (40% used) -->
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <div style="font-size: 13px; color: #333;">Sick Leave</div>
                      <div style="font-size: 13px; font-weight: 600; color: #8a2be2;">3 left <span style="color:#aaa; font-weight:400; font-size:11px;">(2/5 taken)</span></div>
                    </div>
                    <div style="width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                      <div style="width: 40%; height: 100%; background: linear-gradient(to right, #0071e3, #8a2be2); border-radius: 3px;"></div>
                    </div>
                  </div>
                  
                  <!-- Casual Leave (40% used) -->
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <div style="font-size: 13px; color: #333;">Casual Leave</div>
                      <div style="font-size: 13px; font-weight: 600; color: #8a2be2;">6 left <span style="color:#aaa; font-weight:400; font-size:11px;">(4/10 taken)</span></div>
                    </div>
                    <div style="width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                      <div style="width: 40%; height: 100%; background: linear-gradient(to right, #0071e3, #8a2be2); border-radius: 3px;"></div>
                    </div>
                  </div>
                  
                  <!-- Paid Leave (0% used) -->
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <div style="font-size: 13px; color: #333;">Paid Leave</div>
                      <div style="font-size: 13px; font-weight: 600; color: #0071e3;">12 left <span style="color:#aaa; font-weight:400; font-size:11px;">(0/12 taken)</span></div>
                    </div>
                    <div style="width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                      <div style="width: 0%; height: 100%; background: #0071e3; border-radius: 3px;"></div>
                    </div>
                  </div>
                  
                </div>
              </div>`;

const leaveReplace = `              <!-- Leave Balances -->
              <div>
                <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.05em;">Leave Balances</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Sick Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #ff9500;">3 left <span style="color:#aaa; font-weight:400; font-size:11px;">(2/5 taken)</span></div>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Casual Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #ff9500;">6 left <span style="color:#aaa; font-weight:400; font-size:11px;">(4/10 taken)</span></div>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Paid Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #0071e3;">12 left <span style="color:#aaa; font-weight:400; font-size:11px;">(0/12 taken)</span></div>
                  </div>
                  
                </div>
              </div>`;
              
html = html.replace(leaveTarget, leaveReplace);

// Let's add html2pdf.js to the HEAD
const headTarget = `</head>`;
const headReplace = `  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>`;
html = html.replace(headTarget, headReplace);

fs.writeFileSync('public/index.html', html);
console.log("Fixed leaves and added html2pdf!");

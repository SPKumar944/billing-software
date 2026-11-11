const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const targetStr = `          <div id="attendance-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 40px); gap: 8px; text-align: center; justify-content: flex-start;">
            <!-- Grid will be populated by JS -->
          </div>
          
          <div style="display: flex; justify-content: center; gap: 24px; margin-top: 24px; font-size: 12px; color: #555;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #0071e3; border-radius: 3px;"></div> Present
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #ff3b30; border-radius: 3px;"></div> Absent
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave
            </div>
          </div>`;

const newStr = `          <div style="display: flex; gap: 48px; align-items: flex-start;">
            
            <!-- Left: Calendar -->
            <div>
              <div id="attendance-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 40px); gap: 8px; text-align: center; justify-content: flex-start;">
                <!-- Grid will be populated by JS -->
              </div>
              
              <div style="display: flex; justify-content: center; gap: 24px; margin-top: 24px; font-size: 12px; color: #555;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 12px; height: 12px; background: #0071e3; border-radius: 3px;"></div> Present
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 12px; height: 12px; background: #ff3b30; border-radius: 3px;"></div> Absent
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave
                </div>
              </div>
            </div>
            
            <!-- Right: Leave Stats -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 24px;">
              
              <!-- Overall Percentage -->
              <div style="background: #f5f5f7; padding: 24px 16px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; font-weight: 700; color: #0071e3; margin-bottom: 4px;">92%</div>
                <div style="font-size: 11px; color: #888; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">Overall Attendance</div>
              </div>
              
              <!-- Leave Balances -->
              <div>
                <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.05em;">Leave Balances</h4>
                <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Sick Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #333;">2 <span style="color:#888; font-weight:400;">/ 5</span></div>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Casual Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #333;">4 <span style="color:#888; font-weight:400;">/ 10</span></div>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px;">
                    <div style="font-size: 13px; color: #333;">Paid Leave</div>
                    <div style="font-size: 13px; font-weight: 600; color: #333;">0 <span style="color:#888; font-weight:400;">/ 12</span></div>
                  </div>
                  
                </div>
              </div>
              
            </div>
            
          </div>`;

html = html.replace(targetStr, newStr);
fs.writeFileSync('public/index.html', html);
console.log("Added Leave Stats UI!");

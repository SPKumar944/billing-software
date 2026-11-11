const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const target = `            <button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard()">Download ID Card</button>
          </div>
        </div>
      </div>`;

const replace = `            <button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard()">Download ID Card</button>
          </div>
        </div>
        
        <!-- Attendance History Calendar -->
        <div style="max-width: 900px; margin: 32px auto 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="margin: 0;">Attendance History</h2>
            <div style="display: flex; gap: 12px;">
              <select id="attendance-month" class="apple-input" style="padding: 6px 12px; border-radius: 6px;" onchange="reloadAttendanceCalendar()">
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <select id="attendance-year" class="apple-input" style="padding: 6px 12px; border-radius: 6px;" onchange="reloadAttendanceCalendar()">
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </div>
          
          <div id="attendance-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center;">
            <!-- Grid will be populated by JS -->
          </div>
          
          <div style="display: flex; justify-content: center; gap: 24px; margin-top: 24px; font-size: 12px; color: #555;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #34c759; border-radius: 3px;"></div> Inside Geofence
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #ff9500; border-radius: 3px;"></div> Outside Geofence
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> No Record
            </div>
          </div>
        </div>
        
      </div>`;

html = html.replace(target, replace);
fs.writeFileSync('public/index.html', html);
console.log("Added Calendar HTML!");

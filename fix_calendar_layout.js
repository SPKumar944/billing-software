const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Change the max-width of the flex container to 1100px so it fits side-by-side
html = html.replace(
  '<div style="display: flex; gap: 32px; align-items: flex-start; max-width: 900px; margin: 0 auto;">',
  '<div style="display: flex; gap: 32px; align-items: flex-start; max-width: 1100px; margin: 0 auto;">'
);

// 2. We need to wrap the ID Card and Attendance in a new Right Column div.
// The ID Card div starts with: <div style="width: 300px;">
html = html.replace(
  '          <!-- ID Card -->\n          <div style="width: 300px;">',
  '          <!-- Right Column -->\n          <div style="width: 350px; display: flex; flex-direction: column; gap: 24px;">\n            <!-- ID Card -->\n            <div style="width: 100%;">'
);

// 3. Move the Attendance block. It's currently AFTER the flex container closes.
// The flex container closes right before `<!-- Attendance History Calendar -->`
const target = `            <button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard()">Download ID Card</button>
          </div>
        </div>
        
        <!-- Attendance History Calendar -->
        <div style="max-width: 900px; margin: 32px auto 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">`;

const replace = `            <button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard()">Download ID Card</button>
          </div>
        
        <!-- Attendance History Calendar -->
        <div style="background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">`;

html = html.replace(target, replace);

// And we need to add the closing </div> for the Right Column, which was previously the closing div for the main flex container.
// Currently the end is:
//           </div>
//         </div>
//         
//       </div>
//
// We changed the structure so it's now:
// <!-- Right Column -->
//   <div> ID Card </div>
//   <div> Calendar </div>
// </div> (Right Column)
// </div> (Flex Container)

const endTarget = `            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> No Record
            </div>
          </div>
        </div>
        
      </div>`;

const endReplace = `            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> No Record
            </div>
          </div>
        </div>
        
        </div> <!-- End Right Column -->
      </div> <!-- End Flex Container -->
      </div> <!-- End Profile View -->`;

html = html.replace(endTarget, endReplace);

// Let's also update the colors of the legend!
html = html.replace('<div style="width: 12px; height: 12px; background: #34c759; border-radius: 3px;"></div> Inside Geofence', '<div style="width: 12px; height: 12px; background: #0071e3; border-radius: 3px;"></div> Present');
html = html.replace('<div style="width: 12px; height: 12px; background: #ff9500; border-radius: 3px;"></div> Outside Geofence', '<div style="width: 12px; height: 12px; background: #ff3b30; border-radius: 3px;"></div> Absent');
html = html.replace('<div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> No Record', '<div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave');

fs.writeFileSync('public/index.html', html);
console.log("Moved layout!");

const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const target1 = `            </form>
          </div>

          <!-- ID Card Permanent Display -->`;
const replace1 = `            </form>
          </div>

          <!-- Right Column Wrapper -->
          <div style="display: flex; flex-direction: column; gap: 32px; width: 100%;">

          <!-- ID Card Permanent Display -->`;

html = html.replace(target1, replace1);

const target2 = `            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave
            </div>
          </div>
        </div>
        
        </div> <!-- End Right Column -->
      </div> <!-- End Flex Container -->
      </div> <!-- End Profile View -->`;
      
const replace2 = `            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave
            </div>
          </div>
        </div>
        
        </div> <!-- End Right Column Wrapper -->
      </div> <!-- End Grid Container -->
      </div> <!-- End Profile View -->`;

// Try to replace, if it fails because of End Right Column, try without it
let replaced = html.replace(target2, replace2);
if (replaced === html) {
  // The 'End Right Column' comment is probably missing because my fix_calendar_layout script failed on that part too
  const fallbackTarget = `            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave
            </div>
          </div>
        </div>
        
      </div>`;
  const fallbackReplace = `            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave
            </div>
          </div>
        </div>
        
        </div> <!-- End Right Column Wrapper -->
      </div> <!-- End Grid Container -->`;
  html = html.replace(fallbackTarget, fallbackReplace);
} else {
  html = replaced;
}

// Now swap the order of ID Card and Attendance History!
// Attendance goes first, then ID Card.
const idCardRegex = /<!-- ID Card Permanent Display -->([\s\S]*?)<button class="btn btn-secondary" style="width: 100%;" onclick="downloadIDCard\(\)">Download ID Card<\/button>\s*<\/div>\s*<\/div>/;
const attendanceRegex = /<!-- Attendance History Calendar -->([\s\S]*?)<div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"><\/div> Leave\s*<\/div>\s*<\/div>\s*<\/div>/;

const m1 = html.match(idCardRegex);
const m2 = html.match(attendanceRegex);

if (m1 && m2) {
  const idBlock = m1[0];
  const attBlock = m2[0];
  
  // Replace the whole matched area (from start of ID card to end of Attendance) with swapped
  const combinedRegex = /<!-- ID Card Permanent Display -->([\s\S]*?)<div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"><\/div> Leave\s*<\/div>\s*<\/div>\s*<\/div>/;
  
  html = html.replace(combinedRegex, attBlock + "\n\n" + idBlock);
  console.log("Swapped elements!");
} else {
  console.log("Failed to match blocks for swap.");
}


fs.writeFileSync('public/index.html', html);
console.log("Applied fix!");

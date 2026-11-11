const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// The Edit form closes right before ID Card.
const target1 = `            </form>
          </div>

          <!-- ID Card Permanent Display -->`;
const replace1 = `            </form>
          </div>

          <!-- Right Column Wrapper -->
          <div style="display: flex; flex-direction: column; gap: 32px;">

          <!-- ID Card Permanent Display -->`;

// And we need to close the Right Column Wrapper right after Attendance History ends.
const target2 = `            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 12px; height: 12px; background: #f2f2f7; border-radius: 3px; border: 1px solid #e5e5ea;"></div> Leave
            </div>
          </div>
        </div>
        
        </div> <!-- End Right Column -->`; // Let's check if 'End Right Column' is there from my previous script.

// Let's just read the file and do string manipulation cleanly

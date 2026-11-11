const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target = `        let absentCount = 0;
        
        if (recordsByMonth[ym]) {
          recordsByMonth[ym].forEach(r => {
            if (r.status === 'Absent' || r.status === 'Leave') {
              absentCount++;
            }
          });
        }`;

const replacement = `        let absentCount = 0;
        
        if (recordsByMonth[ym]) {
          recordsByMonth[ym].forEach(r => {
            if (r.status === 'Absent' || r.status === 'Leave') {
              absentCount++;
            }
          });
        }
        
        // MOCK: User requested to assume 2 or 3 days of leave from Jan to Aug 2026
        if (y === 2026 && m >= 1 && m <= 8) {
          const mockLeave = (m % 2 === 0) ? 2 : 3;
          absentCount += mockLeave;
        }`;

script = script.replace(target, replacement);
fs.writeFileSync('public/script.js', script);
console.log("Injected mock leave days!");

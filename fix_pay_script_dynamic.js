const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const dynamicScript = `
// --- DYNAMIC PAY HISTORY ---
window.generatePayHistory = async function(empId) {
  const tbody = document.getElementById('pay-history-tbody');
  tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Loading Pay History...</td></tr>';
  
  try {
    // Fetch all attendance records
    const res = await fetch(\`/api/attendance/\${empId}\`);
    if (!res.ok) throw new Error("Failed to fetch attendance");
    const json = await res.json();
    const records = json.data;
    
    // Group records by YYYY-MM
    const recordsByMonth = {};
    records.forEach(r => {
      const date = r.properties.Timestamp.date.start.substring(0, 10); // YYYY-MM-DD
      const ym = date.substring(0, 7); // YYYY-MM
      if (!recordsByMonth[ym]) recordsByMonth[ym] = [];
      recordsByMonth[ym].push({
        date: date,
        status: r.properties.Status.select.name
      });
    });
    
    // Calculate for months Jan 2026 to Current
    const startYear = 2026;
    const startMonth = 1; // Jan
    
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth() + 1;
    
    // Fallback in case today is before 2026
    if (currentYear < 2026) {
      currentYear = 2026;
      currentMonth = 9;
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let baseSalary = parseFloat(document.getElementById('edit_base_salary')?.value) || 18500;

    tbody.innerHTML = '';
    
    // Loop backwards so newest is on top
    for (let y = currentYear; y >= startYear; y--) {
      let maxM = (y === currentYear) ? currentMonth : 12;
      let minM = (y === startYear) ? startMonth : 1;
      
      for (let m = maxM; m >= minM; m--) {
        const ym = \`\${y}-\${m.toString().padStart(2, '0')}\`;
        const daysInMonth = new Date(y, m, 0).getDate();
        
        let absentCount = 0;
        
        if (recordsByMonth[ym]) {
          recordsByMonth[ym].forEach(r => {
            if (r.status === 'Absent' || r.status === 'Leave') {
              absentCount++;
            }
          });
        }
        // Since we are mocking some absents on the calendar (days 12 and 24 if no record), we should align if needed, 
        // but let's stick strictly to what the DB says to be precise. 
        // Oh wait, my script manually added mock absents to the Calendar view if the DB had nothing.
        // Let's also include those mock absents if we have no record for the month, just to keep consistency in the demo,
        // unless the month is truly empty in DB. Let's assume DB is truth.

        const perDaySalary = baseSalary / daysInMonth;
        let netPay = baseSalary - (perDaySalary * absentCount);
        if (netPay < 0) netPay = 0;
        
        const monthLabel = \`\${monthNames[m-1]} \${y}\`;
        const formattedAmount = Math.round(netPay).toLocaleString('en-IN');
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #f5f5f7';
        tr.innerHTML = \`
          <td style="padding: 12px 0; color: #333;">\${monthLabel}</td>
          <td style="padding: 12px 0; text-align: right; font-weight: 500;">₹\${formattedAmount}</td>
          <td style="padding: 12px 0; text-align: right;"><span style="background: #e5ffe5; color: #008000; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Paid</span></td>
          <td style="padding: 12px 0; text-align: center;"><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="downloadPayslip('\${monthLabel}', \${Math.round(netPay)})">Download</button></td>
        \`;
        tbody.appendChild(tr);
      }
    }
  } catch (err) {
    console.error("Error generating pay history:", err);
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color: red;">Failed to load data</td></tr>';
  }
};
`;

// Hook it into viewEmployee() so it loads automatically when the profile opens.
const viewEmpTarget = `  // Load attendance
  const d = new Date();
  document.getElementById('attendance-month').value = d.getMonth() + 1;
  document.getElementById('attendance-year').value = d.getFullYear();
  reloadAttendanceCalendar();`;
  
const viewEmpReplace = `  // Load attendance
  const d = new Date();
  document.getElementById('attendance-month').value = d.getMonth() + 1;
  document.getElementById('attendance-year').value = d.getFullYear();
  reloadAttendanceCalendar();
  
  // Generate dynamic pay history based on attendance
  generatePayHistory(empId);`;

script += dynamicScript;
script = script.replace(viewEmpTarget, viewEmpReplace);

fs.writeFileSync('public/script.js', script);
console.log("Patched script for dynamic pay calculation!");

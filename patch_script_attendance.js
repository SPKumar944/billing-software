const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

// 1. Populate the dropdown in loadEmployeeDirectory
const target1 = `window.employeeList = data;`;
const replace1 = `window.employeeList = data;
    
    // Populate Attendance Dropdown
    const attSelect = document.getElementById('attendance-emp-select');
    if (attSelect) {
      attSelect.innerHTML = '<option value="">-- Choose your name --</option>';
      data.forEach(emp => {
        const name = emp.properties.Name?.title[0]?.plain_text || 'Unknown';
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = name;
        attSelect.appendChild(opt);
      });
    }`;
script = script.replace(target1, replace1);

// 2. Add markAttendance function
const appendFunc = `
// --- ATTENDANCE SYSTEM ---
const STORE_LAT = 12.9716; // Placeholder: Bangalore center
const STORE_LON = 77.5946;
const GEOFENCE_RADIUS_METERS = 100;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; 
}

window.markAttendance = function() {
  const empId = document.getElementById('attendance-emp-select').value;
  const statusDiv = document.getElementById('attendance-status');
  
  if (!empId) {
    statusDiv.style.display = 'block';
    statusDiv.style.background = '#ffe5e5';
    statusDiv.style.color = '#d00000';
    statusDiv.innerText = 'Please select your name first.';
    return;
  }
  
  statusDiv.style.display = 'block';
  statusDiv.style.background = '#e5f0ff';
  statusDiv.style.color = '#0071e3';
  statusDiv.innerText = 'Locating you... Please allow location access.';
  
  if (!navigator.geolocation) {
    statusDiv.style.background = '#ffe5e5';
    statusDiv.style.color = '#d00000';
    statusDiv.innerText = 'Geolocation is not supported by your browser.';
    return;
  }
  
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    const distance = Math.round(calculateDistance(lat, lon, STORE_LAT, STORE_LON));
    let status = distance <= GEOFENCE_RADIUS_METERS ? "Inside Geofence" : "Outside Geofence";
    
    statusDiv.innerText = \`Recording... Distance: \${distance}m\`;
    
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId, lat, lon, distance, status })
      });
      
      const data = await res.json();
      if (res.ok) {
        statusDiv.style.background = status === 'Inside Geofence' ? '#e5ffe5' : '#fff0e5';
        statusDiv.style.color = status === 'Inside Geofence' ? '#008000' : '#e65c00';
        statusDiv.innerText = \`✅ Attendance Marked Successfully! Status: \${status} (\${distance}m)\`;
      } else {
        throw new Error(data.error || 'Failed to mark attendance');
      }
    } catch (e) {
      statusDiv.style.background = '#ffe5e5';
      statusDiv.style.color = '#d00000';
      statusDiv.innerText = 'Error saving attendance: ' + e.message;
    }
  }, (error) => {
    statusDiv.style.background = '#ffe5e5';
    statusDiv.style.color = '#d00000';
    statusDiv.innerText = 'Unable to retrieve your location. ' + error.message;
  }, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });
};
`;

script += appendFunc;
fs.writeFileSync('public/script.js', script);
console.log("Patched script.js for Attendance logic!");

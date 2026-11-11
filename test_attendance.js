const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;

const html = fs.readFileSync('public/index.html', 'utf8');
const script = fs.readFileSync('public/script.js', 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost:3000',
  runScripts: 'dangerously',
  resources: 'usable'
});

dom.window.eval(script);

// Mock fetch
const originalFetch = dom.window.fetch;
dom.window.fetch = async function(url, options) {
  if (url === '/api/employees' && (!options || options.method === 'GET')) {
    return {
      ok: true,
      json: async () => ([
        { id: '3dffc44d-958c-81d4-a60f-cf84e662a67a', properties: { Name: { title: [{ plain_text: 'Test Employee' }] } } }
      ])
    };
  }
  // Let the actual fetch go through for POST /api/attendance to hit the local node server
  if (url === '/api/attendance') {
    return require('node-fetch')('http://localhost:3000/api/attendance', {
      method: options.method,
      headers: options.headers,
      body: options.body
    });
  }
  return { ok: true, json: async () => ({}) };
};

// Mock geolocation
dom.window.navigator.geolocation = {
  getCurrentPosition: function(success, error, options) {
    console.log("Mock Geolocation called!");
    // Simulate being slightly outside the geofence (e.g. Bangalore center is 12.9716, 77.5946)
    success({
      coords: {
        latitude: 12.9720,
        longitude: 77.5950
      }
    });
  }
};

setTimeout(async () => {
  try {
    // 1. Load employees to populate dropdown
    await dom.window.loadEmployeeDirectory();
    
    // 2. Select employee
    const select = dom.window.document.getElementById('attendance-emp-select');
    console.log("Dropdown options:", select.innerHTML);
    select.value = '3dffc44d-958c-81d4-a60f-cf84e662a67a';
    
    // 3. Mark attendance
    console.log("Clicking Mark Attendance...");
    dom.window.markAttendance();
    
    // 4. Wait for fetch to complete
    setTimeout(() => {
      const status = dom.window.document.getElementById('attendance-status');
      console.log("Final Status:", status.innerText);
      process.exit(0);
    }, 2000);
    
  } catch(e) {
    console.error("Test failed:", e);
    process.exit(1);
  }
}, 1000);

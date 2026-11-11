const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const script = fs.readFileSync('public/script.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const window = dom.window;

// Mock fetch
window.fetch = async (url) => {
  if (url === '/api/employees') {
    return {
      ok: true,
      json: async () => JSON.parse(fs.readFileSync('api_mock.json', 'utf8'))
    };
  }
};

// Run script
const scriptEl = window.document.createElement('script');
scriptEl.textContent = script;
window.document.body.appendChild(scriptEl);

setTimeout(async () => {
  try {
    console.log("Calling loadEmployeeDirectory...");
    await window.loadEmployeeDirectory();
    console.log("GRID HTML:", window.document.getElementById('employee-grid').innerHTML);
    
    // Let's also check if CSS hides it? No, JSDOM won't easily compute that.
  } catch(e) {
    console.error("ERROR:", e);
  }
}, 500);

setTimeout(() => {
  try {
    console.log("Calling openProfile('3dffc44d-958c-81d4-a60f-cf84e662a67a')...");
    window.openProfile('3dffc44d-958c-81d4-a60f-cf84e662a67a');
    console.log("Profile opened successfully!");
    console.log("edit_doj value:", window.document.getElementById('edit_doj').value);
  } catch(e) {
    console.error("ERROR IN OPEN PROFILE:", e);
  }
}, 1000);

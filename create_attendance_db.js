const https = require('https');
const fs = require('fs');

const TOKEN = process.env.NOTION_TOKEN || '';
const MENU_DB_ID = '3cffc44d958c809dbeafc83e4f9e9f31';

// Read the Employee DB ID from server.js
let serverCode = fs.readFileSync('server.js', 'utf8');
const empDbMatch = serverCode.match(/const EMPLOYEE_DB_ID = "([^"]+)";/);
if (!empDbMatch) process.exit(1);
const EMP_DB_ID = empDbMatch[1];

function req(path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path, method,
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      }
    };
    const request = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    if (body) request.write(JSON.stringify(body));
    request.end();
  });
}

async function run() {
  // Use the same parent page if we already created it, but just creating a new one is fine.
  const page = await req('/v1/pages', 'POST', {
    parent: { database_id: MENU_DB_ID },
    properties: { "Name": { title: [{ text: { content: "SYSTEM_ATTENDANCE_DB_HOLDER_2" } }] } }
  });
  const parentPageId = page.id;
  console.log("Created parent page:", parentPageId);

  // 2. Create the Attendance Database inside that page
  const db = await req('/v1/databases', 'POST', {
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: "Attendance Records" } }],
    properties: {
      "Record ID": { title: {} },
      "Employee": { relation: { database_id: EMP_DB_ID, single_property: {} } },
      "Timestamp": { date: {} },
      "Status": { select: { options: [{ name: "Inside Geofence", color: "green" }, { name: "Outside Geofence", color: "red" }] } },
      "Latitude": { number: { format: "number" } },
      "Longitude": { number: { format: "number" } },
      "Distance (m)": { number: { format: "number" } }
    }
  });
  
  if (db.object === 'error') {
    console.error("Failed to create DB:", JSON.stringify(db));
    return;
  }
  
  console.log("Created Attendance Database:", db.id);
  
  // 3. Write it to server.js
  serverCode = serverCode.replace('const DB_ID =', 'const ATTENDANCE_DB_ID = "' + db.id + '";\nconst DB_ID =');
  fs.writeFileSync('server.js', serverCode);
  console.log("Patched server.js with Attendance DB ID!");
}

run();

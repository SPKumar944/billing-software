const https = require('https');
const fs = require('fs');

const TOKEN = process.env.NOTION_TOKEN || '';

// Read server.js to extract EMPLOYEE_DB_ID
let serverCode = fs.readFileSync('server.js', 'utf8');
const match = serverCode.match(/const EMPLOYEE_DB_ID = "([^"]+)";/);
if (!match) {
  console.log("Could not find EMPLOYEE_DB_ID");
  process.exit(1);
}
const DB_ID = match[1];

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
  console.log("Updating DB:", DB_ID);
  
  const res = await req('/v1/databases/' + DB_ID, 'PATCH', {
    properties: {
      "Date of Birth": { date: {} },
      "Blood Group": { select: { options: [] } },
      "Father/Spouse Name": { rich_text: {} },
      "Marital Status": { select: { options: [] } },
      "Current Address": { rich_text: {} },
      "Permanent Address": { rich_text: {} },
      "UAN Number": { rich_text: {} },
      "Email Address": { email: {} },
      "Employee ID": { rich_text: {} }
    }
  });
  
  if (res.object === 'error') {
    console.error("Failed to update database schema:", res.message);
  } else {
    console.log("Schema updated successfully!");
  }
}

run();

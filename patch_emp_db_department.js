const https = require('https');
const fs = require('fs');
const TOKEN = process.env.NOTION_TOKEN || '';

let serverCode = fs.readFileSync('server.js', 'utf8');
const match = serverCode.match(/const EMPLOYEE_DB_ID = "([^"]+)";/);
if (!match) process.exit(1);
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
  const res = await req('/v1/databases/' + DB_ID, 'PATCH', {
    properties: {
      "Department": { select: { options: [] } }
    }
  });
  console.log("Schema updated for Department:", res.object === 'error' ? res.message : "Success");
}
run();

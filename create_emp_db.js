const https = require('https');

const TOKEN = process.env.NOTION_TOKEN || '';
const MENU_DB_ID = '3cffc44d958c809dbeafc83e4f9e9f31';

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
  // 1. Create a dummy page in the Menu DB
  const page = await req('/v1/pages', 'POST', {
    parent: { database_id: MENU_DB_ID },
    properties: { "Name": { title: [{ text: { content: "SYSTEM_EMPLOYEE_DB_HOLDER" } }] } }
  });
  const parentPageId = page.id;
  console.log("Created parent page:", parentPageId);

  // 2. Create the Employee Database inside that page
  const db = await req('/v1/databases', 'POST', {
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: "Employees" } }],
    properties: {
      "Name": { title: {} },
      "Role": { select: { options: [] } },
      "Date of Joining": { date: {} },
      "Mobile": { phone_number: {} },
      "Emergency Contact": { rich_text: {} },
      "Emergency Phone": { phone_number: {} },
      "Emergency Relationship": { rich_text: {} },
      "ID Type": { select: { options: [] } },
      "ID Number": { rich_text: {} },
      "Bank Name": { rich_text: {} },
      "Account Number": { rich_text: {} },
      "IFSC Code": { rich_text: {} },
      "Photo": { files: {} },
      "ID Document": { files: {} },
      "Address Proof": { files: {} }
    }
  });
  console.log("Created Employee Database:", db.id);
  
  // 3. Write it to an env file or server.js
  const fs = require('fs');
  let serverCode = fs.readFileSync('server.js', 'utf8');
  serverCode = serverCode.replace('const DB_ID =', 'const EMPLOYEE_DB_ID = "' + db.id + '";\nconst DB_ID =');
  fs.writeFileSync('server.js', serverCode);
  console.log("Patched server.js with Employee DB ID!");
}

run();

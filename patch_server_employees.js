const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const apiEmployees = `
  // POST /api/employees: Create a new employee record in Notion
  if (pathname === '/api/employees' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        const notionPayload = {
          parent: { database_id: EMPLOYEE_DB_ID },
          properties: {
            "Name": { title: [{ text: { content: data.name } }] }
          }
        };

        const addProp = (key, type, valFunc) => {
          notionPayload.properties[key] = valFunc();
        };

        if (data.role) addProp("Role", "select", () => ({ select: { name: data.role } }));
        if (data.doj) addProp("Date of Joining", "date", () => ({ date: { start: data.doj } }));
        if (data.mobile) addProp("Mobile", "phone_number", () => ({ phone_number: data.mobile }));
        if (data.emergencyName) addProp("Emergency Contact", "rich_text", () => ({ rich_text: [{ text: { content: data.emergencyName } }] }));
        if (data.emergencyPhone) addProp("Emergency Phone", "phone_number", () => ({ phone_number: data.emergencyPhone }));
        if (data.emergencyRel) addProp("Emergency Relationship", "rich_text", () => ({ rich_text: [{ text: { content: data.emergencyRel } }] }));
        if (data.idType) addProp("ID Type", "select", () => ({ select: { name: data.idType } }));
        if (data.idNumber) addProp("ID Number", "rich_text", () => ({ rich_text: [{ text: { content: data.idNumber } }] }));
        if (data.bankName) addProp("Bank Name", "rich_text", () => ({ rich_text: [{ text: { content: data.bankName } }] }));
        if (data.bankAcc) addProp("Account Number", "rich_text", () => ({ rich_text: [{ text: { content: data.bankAcc } }] }));
        if (data.bankIfsc) addProp("IFSC Code", "rich_text", () => ({ rich_text: [{ text: { content: data.bankIfsc } }] }));

        // Handle File Uploads (save locally, push url to Notion)
        const processFile = (fileObj, propName) => {
          if (!fileObj || !fileObj.data) return;
          const crypto = require('crypto');
          const path = require('path');
          const base64Data = fileObj.data.replace(/^data:.*?;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          const ext = fileObj.name.split('.').pop() || 'jpg';
          const filename = \`emp_\${crypto.randomUUID()}.\${ext}\`;
          const filepath = path.join(__dirname, 'public', 'uploads', filename);
          
          if (!fs.existsSync(path.join(__dirname, 'public', 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });
          }
          fs.writeFileSync(filepath, buffer);
          
          addProp(propName, "files", () => ({
            files: [{ type: "external", name: fileObj.name, external: { url: \`http://localhost:3000/uploads/\${filename}\` } }]
          }));
        };

        processFile(data.photo, "Photo");
        processFile(data.idDoc, "ID Document");
        processFile(data.addressDoc, "Address Proof");

        const fetch = require('node-fetch');
        const notionRes = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + TOKEN,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notionPayload)
        });

        const notionData = await notionRes.json();
        if (notionData.object === 'error') throw new Error(notionData.message);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }
`;

code = code.replace(/\/\/ GET \/api\/materials:/, apiEmployees + '\n  // GET /api/materials:');
fs.writeFileSync('server.js', code);

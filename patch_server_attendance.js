const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const target = `  // POST /api/employees: Create a new employee record in Notion`;
const replace = `  // POST /api/attendance: Record employee attendance
  if (pathname === '/api/attendance' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        // ATTENDANCE_DB_ID was written at the top of the file
        const notionPayload = {
          parent: { database_id: ATTENDANCE_DB_ID },
          properties: {
            "Record ID": { title: [{ text: { content: "ATT-" + Date.now() } }] },
            "Employee": { relation: [{ id: data.empId }] },
            "Timestamp": { date: { start: new Date().toISOString() } },
            "Status": { select: { name: data.status } },
            "Latitude": { number: parseFloat(data.lat) },
            "Longitude": { number: parseFloat(data.lon) },
            "Distance (m)": { number: parseInt(data.distance) }
          }
        };

        const resNotion = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + NOTION_API_KEY,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify(notionPayload)
        });

        const json = await resNotion.json();
        if (json.object === 'error') {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: json.message }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, recordId: json.id }));
        }
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // POST /api/employees: Create a new employee record in Notion`;

server = server.replace(target, replace);
fs.writeFileSync('server.js', server);
console.log("Patched server.js with POST /api/attendance endpoint!");

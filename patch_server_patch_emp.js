const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const patchEndpoint = `
  // PATCH /api/employees/:id : Update employee in Notion
  if (pathname.startsWith('/api/employees/') && req.method === 'PATCH') {
    const pageId = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const notionPayload = { properties: {} };
        
        if (data.name) notionPayload.properties["Name"] = { title: [{ text: { content: data.name } }] };
        if (data.role) notionPayload.properties["Role"] = { select: { name: data.role } };
        if (data.blood) notionPayload.properties["Blood Group"] = { select: { name: data.blood } };
        if (data.mobile) notionPayload.properties["Mobile"] = { phone_number: data.mobile };
        if (data.email) notionPayload.properties["Email Address"] = { email: data.email };
        
        const notionRes = await fetch(\`https://api.notion.com/v1/pages/\${pageId}\`, {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer ' + NOTION_API_KEY,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notionPayload)
        });
        
        const notionData = await notionRes.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch(err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }
`;

code = code.replace(/\/\/ GET \/api\/employees:/, patchEndpoint + '\n  // GET /api/employees:');
fs.writeFileSync('server.js', code);

const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const target = `  // POST /api/attendance: Record employee attendance`;
const replace = `  // GET /api/attendance/:empId: Get attendance records for a specific month
  if (pathname.startsWith('/api/attendance/') && req.method === 'GET') {
    const empId = pathname.split('/')[3];
    const urlObj = new URL(req.url, \`http://\${req.headers.host}\`);
    const year = urlObj.searchParams.get('year');
    const month = urlObj.searchParams.get('month'); // 1-12
    
    try {
      const paddedMonth = month.padStart(2, '0');
      const startDate = \`\${year}-\${paddedMonth}-01\`;
      
      // Calculate next month for the 'before' filter
      let nextMonth = parseInt(month) + 1;
      let nextYear = parseInt(year);
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      const nextMonthPadded = nextMonth.toString().padStart(2, '0');
      const endDate = \`\${nextYear}-\${nextMonthPadded}-01\`;

      const notionPayload = {
        filter: {
          and: [
            { property: "Employee", relation: { contains: empId } },
            { property: "Timestamp", date: { on_or_after: startDate } },
            { property: "Timestamp", date: { before: endDate } }
          ]
        },
        sorts: [{ property: "Timestamp", direction: "ascending" }]
      };

      const resNotion = await fetch(\`https://api.notion.com/v1/databases/\${ATTENDANCE_DB_ID}/query\`, {
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
        const records = json.results.map(page => {
          return {
            id: page.id,
            timestamp: page.properties.Timestamp?.date?.start,
            status: page.properties.Status?.select?.name,
            distance: page.properties['Distance (m)']?.number
          };
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(records));
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST /api/attendance: Record employee attendance`;

server = server.replace(target, replace);
fs.writeFileSync('server.js', server);
console.log("Patched server.js with GET /api/attendance/:empId endpoint!");

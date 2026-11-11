const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const getEmpEndpoint = `
  // GET /api/employees: Fetch employees from Notion
  if (pathname === '/api/employees' && req.method === 'GET') {
    try {
      const fetch = require('node-fetch'); // wait, use native fetch! Actually no require needed in Node 18+
      const notionRes = await fetch(\`https://api.notion.com/v1/databases/\${EMPLOYEE_DB_ID}/query\`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + TOKEN,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      const data = await notionRes.json();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data.results || []));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }
`;

code = code.replace(/\/\/ GET \/api\/materials:/, getEmpEndpoint + '\n  // GET /api/materials:');
fs.writeFileSync('server.js', code);

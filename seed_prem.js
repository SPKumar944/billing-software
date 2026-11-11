const https = require('https');
const TOKEN = process.env.NOTION_TOKEN || '';
const DB_ID = '3dffc44d-958c-81a3-842c-d0263d77615e';

const emp = {
  name: 'Prem Kumar', role: 'Store Manager', blood: 'B+', empid: 'EMP-999999', 
  phone: '+919999999999', email: 'prem@restaurant.com'
};

const req = https.request({
  hostname: 'api.notion.com',
  path: '/v1/pages',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + TOKEN,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log(JSON.parse(data).object));
});

req.write(JSON.stringify({
  parent: { database_id: DB_ID },
  properties: {
    "Name": { title: [{ text: { content: emp.name } }] },
    "Role": { select: { name: emp.role } },
    "Blood Group": { select: { name: emp.blood } },
    "Employee ID": { rich_text: [{ text: { content: emp.empid } }] },
    "Mobile": { phone_number: emp.phone },
    "Email Address": { email: emp.email }
  }
}));
req.end();

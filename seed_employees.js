const https = require('https');

const TOKEN = process.env.NOTION_TOKEN || '';
const DB_ID = '3dffc44d-958c-81a3-842c-d0263d77615e';

const employees = [
  {
    name: 'Rahul Sharma', role: 'Store Manager', blood: 'O+', empid: 'EMP-654321', 
    phone: '+919876543210', email: 'rahul@restaurant.com'
  },
  {
    name: 'Priya Patel', role: 'Chef', blood: 'A+', empid: 'EMP-112233', 
    phone: '+919876543211', email: 'priya@restaurant.com'
  },
  {
    name: 'Amit Kumar', role: 'Cashier', blood: 'B-', empid: 'EMP-445566', 
    phone: '+919876543212', email: 'amit@restaurant.com'
  }
];

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
  for (const emp of employees) {
    const res = await req('/v1/pages', 'POST', {
      parent: { database_id: DB_ID },
      properties: {
        "Name": { title: [{ text: { content: emp.name } }] },
        "Role": { select: { name: emp.role } },
        "Blood Group": { select: { name: emp.blood } },
        "Employee ID": { rich_text: [{ text: { content: emp.empid } }] },
        "Mobile": { phone_number: emp.phone },
        "Email Address": { email: emp.email }
      }
    });
    console.log("Added:", emp.name, res.object === 'error' ? res.message : 'Success');
  }
}
run();

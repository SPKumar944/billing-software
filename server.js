const http = require('http');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const EMPLOYEE_DB_ID = "3dffc44d-958c-81a3-842c-d0263d77615e";
const ATTENDANCE_DB_ID = "3dffc44d-958c-8136-ba06-cfce9d0db1aa";

const headers = {
  'Authorization': `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  console.log(`[${req.method}] ${pathname}`);

  // GET: Fetch all items
  if (pathname === '/api/menu' && req.method === 'GET') {
    try {
      const itemsRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
        method: 'POST', headers
      });
      const itemsData = await itemsRes.json();

      if (itemsData.error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: itemsData.error.message }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ items: itemsData.results }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST (Create) or PATCH (Update)
  if (pathname.startsWith('/api/menu') && (req.method === 'POST' || req.method === 'PATCH')) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const dbRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}`, { headers });
        const dbSchema = await dbRes.json();
        
        if (dbSchema.error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: dbSchema.error.message }));
          return;
        }

        const validProps = dbSchema.properties;
        const notionPayload = { properties: {} };

        // If POST, we need parent. If PATCH, we don't.
        if (req.method === 'POST') {
          notionPayload.parent = { database_id: NOTION_DB_ID };
        }

        // Title property
        if (data.Item_Name) {
          if (validProps["Item_Name"]) {
            notionPayload.properties["Item_Name"] = { title: [{ text: { content: data.Item_Name } }] };
          } else if (validProps["Name"]) {
            notionPayload.properties["Name"] = { title: [{ text: { content: data.Item_Name } }] };
          }
        }

        const addProp = (name, type, payloadBuilder) => {
          if (validProps[name] && validProps[name].type === type) {
            notionPayload.properties[name] = payloadBuilder();
          }
        };

        if (data.Base_Price !== undefined && data.Base_Price !== "") addProp("Base_Price", "number", () => ({ number: Number(data.Base_Price) }));
        else if (data.Base_Price === "") addProp("Base_Price", "number", () => ({ number: null }));

        if (data.Item_ID !== undefined && data.Item_ID !== "") addProp("Item_ID", "rich_text", () => ({ rich_text: [{ text: { content: data.Item_ID } }] }));
        else if (data.Item_ID === "") addProp("Item_ID", "rich_text", () => ({ rich_text: [] }));

        if (data.Category_ID !== undefined && data.Category_ID !== "") addProp("Category_ID", "select", () => ({ select: { name: data.Category_ID } }));
        else if (data.Category_ID === "") addProp("Category_ID", "select", () => ({ select: null }));

        if (data.Menu_Type !== undefined && data.Menu_Type !== "") addProp("Menu_Type", "select", () => ({ select: { name: data.Menu_Type } }));
        else if (data.Menu_Type === "") addProp("Menu_Type", "select", () => ({ select: null }));

        if (data.Item_Nature !== undefined && data.Item_Nature !== "") addProp("Item_Nature", "select", () => ({ select: { name: data.Item_Nature } }));
        else if (data.Item_Nature === "") addProp("Item_Nature", "select", () => ({ select: null }));

        if (data.Tax_Tier_ID !== undefined && data.Tax_Tier_ID !== "") addProp("Tax_Tier_ID", "rich_text", () => ({ rich_text: [{ text: { content: data.Tax_Tier_ID } }] }));
        else if (data.Tax_Tier_ID === "") addProp("Tax_Tier_ID", "rich_text", () => ({ rich_text: [] }));

        if (data.COGS !== undefined && data.COGS !== "") addProp("Cost_Of_Goods", "number", () => ({ number: Number(data.COGS) }));
        else if (data.COGS === "") addProp("Cost_Of_Goods", "number", () => ({ number: null }));

        if (data.Unit_Stock_Count !== undefined && data.Unit_Stock_Count !== "") addProp("Unit_Stock_Count", "number", () => ({ number: Number(data.Unit_Stock_Count) }));
        else if (data.Unit_Stock_Count === "") addProp("Unit_Stock_Count", "number", () => ({ number: null }));

        if (data.Daily_Quota !== undefined && data.Daily_Quota !== "") addProp("Daily_Quota", "number", () => ({ number: Number(data.Daily_Quota) }));
        else if (data.Daily_Quota === "") addProp("Daily_Quota", "number", () => ({ number: null }));

        if (data.Low_Stock_Threshold !== undefined && data.Low_Stock_Threshold !== "") addProp("Low_Stock_Threshold", "number", () => ({ number: Number(data.Low_Stock_Threshold) }));
        else if (data.Low_Stock_Threshold === "") addProp("Low_Stock_Threshold", "number", () => ({ number: null }));

        if (data.Prep_Time_Mins !== undefined && data.Prep_Time_Mins !== "") addProp("Prep_Time_Mins", "number", () => ({ number: Number(data.Prep_Time_Mins) }));
        else if (data.Prep_Time_Mins === "") addProp("Prep_Time_Mins", "number", () => ({ number: null }));

        if (data.Recipe_BOM_ID !== undefined && data.Recipe_BOM_ID !== "") addProp("Recipe_BOM_ID", "rich_text", () => ({ rich_text: [{ text: { content: data.Recipe_BOM_ID } }] }));
        else if (data.Recipe_BOM_ID === "") addProp("Recipe_BOM_ID", "rich_text", () => ({ rich_text: [] }));

        if (data.Add_Ons_Allowed !== undefined && data.Add_Ons_Allowed !== "") addProp("Add_Ons_Allowed", "rich_text", () => ({ rich_text: [{ text: { content: data.Add_Ons_Allowed } }] }));
        else if (data.Add_Ons_Allowed === "") addProp("Add_Ons_Allowed", "rich_text", () => ({ rich_text: [] }));

        if (data.Is_Active !== undefined) addProp("Is_Active", "checkbox", () => ({ checkbox: Boolean(data.Is_Active) }));
        
        // Handle uploaded images to local filesystem and Notion files property
        if (data.Uploaded_Images && Array.isArray(data.Uploaded_Images) && data.Uploaded_Images.length > 0) {
          const fs = require('fs');
          const crypto = require('crypto');
          const filePayloads = [];
          
          for (const img of data.Uploaded_Images) {
            if (img.data) {
              const base64Data = img.data.replace(/^data:image\/\w+;base64,/, "");
              const buffer = Buffer.from(base64Data, 'base64');
              const ext = img.name.split('.').pop() || 'jpg';
              const filename = `${crypto.randomUUID()}.${ext}`;
              const filepath = path.join(__dirname, 'public', 'uploads', filename);
              
              // Ensure uploads dir exists
              if (!fs.existsSync(path.join(__dirname, 'public', 'uploads'))) {
                fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });
              }
              
              fs.writeFileSync(filepath, buffer);
              
              // Notion requires public URLs, but we are local, so we just use localhost.
              filePayloads.push({
                type: "external",
                name: img.name,
                external: { url: `http://localhost:3000/uploads/${filename}` }
              });
            }
          }
          
          if (filePayloads.length > 0) {
            addProp("Images", "files", () => ({ files: filePayloads }));
          }
        }

        let endpoint = `https://api.notion.com/v1/pages`;
        if (req.method === 'PATCH') {
          const pageId = pathname.split('/')[3];
          endpoint = `https://api.notion.com/v1/pages/${pageId}`;
        }

        const notionRes = await fetch(endpoint, {
          method: req.method,
          headers,
          body: JSON.stringify(notionPayload)
        });

        const notionData = await notionRes.json();

        // Properly catch Notion API errors
        if (notionData.object === 'error' || notionData.error) {
          console.error("Notion API Error:", notionData);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: notionData.message || notionData.error.message }));
          return;
        }

        res.writeHead(req.method === 'POST' ? 201 : 200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, item: notionData }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  
  // GET /api/attendance/:empId: Get attendance records for a specific month
  if (pathname.startsWith('/api/attendance/') && req.method === 'GET') {
    const empId = pathname.split('/')[3];
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const year = urlObj.searchParams.get('year');
    const month = urlObj.searchParams.get('month'); // 1-12
    
    try {
      const paddedMonth = month.padStart(2, '0');
      const startDate = `${year}-${paddedMonth}-01`;
      
      // Calculate next month for the 'before' filter
      let nextMonth = parseInt(month) + 1;
      let nextYear = parseInt(year);
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      const nextMonthPadded = nextMonth.toString().padStart(2, '0');
      const endDate = `${nextYear}-${nextMonthPadded}-01`;

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

      const resNotion = await fetch(`https://api.notion.com/v1/databases/${ATTENDANCE_DB_ID}/query`, {
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

  // POST /api/attendance: Record employee attendance
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
        if (data.department) addProp("Department", "select", () => ({ select: { name: data.department } }));
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

        if (data.dob) addProp("Date of Birth", "date", () => ({ date: { start: data.dob } }));
        if (data.blood) addProp("Blood Group", "select", () => ({ select: { name: data.blood } }));
        if (data.father) addProp("Father/Spouse Name", "rich_text", () => ({ rich_text: [{ text: { content: data.father } }] }));
        if (data.marital) addProp("Marital Status", "select", () => ({ select: { name: data.marital } }));
        if (data.currentAddress) addProp("Current Address", "rich_text", () => ({ rich_text: [{ text: { content: data.currentAddress } }] }));
        if (data.permAddress) addProp("Permanent Address", "rich_text", () => ({ rich_text: [{ text: { content: data.permAddress } }] }));
        if (data.uan) addProp("UAN Number", "rich_text", () => ({ rich_text: [{ text: { content: data.uan } }] }));
        if (data.email) addProp("Email Address", "email", () => ({ email: data.email }));
        
        // Generate an Employee ID automatically
        const empIdStr = "EMP-" + Math.floor(100000 + Math.random() * 900000);
        addProp("Employee ID", "rich_text", () => ({ rich_text: [{ text: { content: empIdStr } }] }));

        // Handle File Uploads (save locally, push url to Notion)
        const processFile = (fileObj, propName) => {
          if (!fileObj || !fileObj.data) return;
          const crypto = require('crypto');
          const path = require('path');
          const base64Data = fileObj.data.replace(/^data:.*?;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          const ext = fileObj.name.split('.').pop() || 'jpg';
          const filename = `emp_${crypto.randomUUID()}.${ext}`;
          const filepath = path.join(__dirname, 'public', 'uploads', filename);
          
          if (!fs.existsSync(path.join(__dirname, 'public', 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });
          }
          fs.writeFileSync(filepath, buffer);
          
          addProp(propName, "files", () => ({
            files: [{ type: "external", name: fileObj.name, external: { url: `http://localhost:3000/uploads/${filename}` } }]
          }));
        };

        processFile(data.photo, "Photo");
        processFile(data.idDoc, "ID Document");
        processFile(data.addressDoc, "Address Proof");

        
        const notionRes = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + NOTION_API_KEY,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notionPayload)
        });

        const notionData = await notionRes.json();
        if (notionData.object === 'error') throw new Error(notionData.message);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, empId: empIdStr }));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  
  
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
        if (data.department) notionPayload.properties["Department"] = { select: { name: data.department } };
        if (data.blood) notionPayload.properties["Blood Group"] = { select: { name: data.blood } };
        if (data.mobile) notionPayload.properties["Mobile"] = { phone_number: data.mobile };
        if (data.email) notionPayload.properties["Email Address"] = { email: data.email };
        
        if (data.dob) notionPayload.properties["Date of Birth"] = { date: { start: data.dob } };
        if (data.doj) notionPayload.properties["Date of Joining"] = { date: { start: data.doj } };
        if (data.father) notionPayload.properties["Father/Spouse Name"] = { rich_text: [{ text: { content: data.father } }] };
        if (data.marital) notionPayload.properties["Marital Status"] = { select: { name: data.marital } };
        if (data.currentAddress) notionPayload.properties["Current Address"] = { rich_text: [{ text: { content: data.currentAddress } }] };
        if (data.permAddress) notionPayload.properties["Permanent Address"] = { rich_text: [{ text: { content: data.permAddress } }] };
        if (data.uan) notionPayload.properties["UAN Number"] = { rich_text: [{ text: { content: data.uan } }] };
        
        if (data.emergencyName) notionPayload.properties["Emergency Contact"] = { rich_text: [{ text: { content: data.emergencyName } }] };
        if (data.emergencyPhone) notionPayload.properties["Emergency Phone"] = { phone_number: data.emergencyPhone };
        if (data.emergencyRel) notionPayload.properties["Emergency Relationship"] = { rich_text: [{ text: { content: data.emergencyRel } }] };
        
        if (data.idType) notionPayload.properties["ID Type"] = { select: { name: data.idType } };
        if (data.idNumber) notionPayload.properties["ID Number"] = { rich_text: [{ text: { content: data.idNumber } }] };
        if (data.bankName) notionPayload.properties["Bank Name"] = { rich_text: [{ text: { content: data.bankName } }] };
        if (data.bankAcc) notionPayload.properties["Account Number"] = { rich_text: [{ text: { content: data.bankAcc } }] };
        if (data.bankIfsc) notionPayload.properties["IFSC Code"] = { rich_text: [{ text: { content: data.bankIfsc } }] };
        
        const notionRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
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

  // GET /api/employees: Fetch employees from Notion
  if (pathname === '/api/employees' && req.method === 'GET') {
    try {
      const notionRes = await fetch(`https://api.notion.com/v1/databases/${EMPLOYEE_DB_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + NOTION_API_KEY,
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

  // GET /api/materials: Fetch raw materials pricing
  if (pathname === '/api/materials' && req.method === 'GET') {
    const materialsPath = path.join(__dirname, 'data', 'materials.json');
    if (fs.existsSync(materialsPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(fs.readFileSync(materialsPath, 'utf-8'));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({}));
    }
    return;
  }

  // POST /api/materials: Save raw materials pricing
  if (pathname === '/api/materials' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const materialsPath = path.join(dataDir, 'materials.json');
        
        // ensure valid JSON
        JSON.parse(body);
        fs.writeFileSync(materialsPath, body, 'utf-8');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, empId: empIdStr }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  const extname = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  }[extname] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

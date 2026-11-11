const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf-8');
let js = fs.readFileSync('public/script.js', 'utf-8');

// HTML: Remove file input, add URL input
html = html.replace(
  /<label>Image Upload<\/label>[\s\S]*?<\/div>/m,
  '<label>Image URL</label>\n<input type="url" id="Image_URL" class="apple-input" placeholder="https://example.com/image.jpg">\n</div>'
);
fs.writeFileSync('public/index.html', html);

// JS: Update form submit payload to Notion Payload format
const jsPatch = `
    const payload = {
      Item_Name: document.getElementById('Item_Name').value,
      Item_ID: document.getElementById('Item_ID').value,
      Base_Price: document.getElementById('Base_Price').value,
      Category_ID: document.getElementById('Category_ID').value,
      Menu_Type: document.getElementById('Menu_Type').value,
      Item_Nature: document.getElementById('Item_Nature').value,
      Tax_Tier_ID: document.getElementById('Tax_Tier_ID').value,
      COGS: document.getElementById('COGS').value,
      Unit_Stock_Count: document.getElementById('Unit_Stock_Count').value,
      Daily_Quota: Math.round(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].reduce((sum, d) => sum + (Number(document.getElementById(\`Quota_\${d}\`).value) || 0), 0) / 7),
      Low_Stock_Threshold: document.getElementById('Low_Stock_Threshold').value,
      Prep_Time_Mins: document.getElementById('Prep_Time_Mins').value,
      Recipe_BOM_ID: (bomIngredients.length > 0 || Object.values(bomPayload.dailyQuotas).some(q => q > 0) || bomPayload.manualWeeklyQty) ? JSON.stringify(bomPayload) : '',
      Add_Ons_Allowed: addonsData.length > 0 ? JSON.stringify(addonsData) : '',
      Is_Active: document.getElementById('Is_Active').checked,
      Image_URL: document.getElementById('Image_URL').value
    };

    const notionPayload = { properties: {} };
    if (!editingItemId) notionPayload.parent = { database_id: DATABASE_ID };
    
    const setProp = (name, val, type) => {
      if (val !== "" && val !== null && val !== undefined) {
        if (type === 'title') notionPayload.properties[name] = { title: [{ text: { content: val } }] };
        if (type === 'rich_text') notionPayload.properties[name] = { rich_text: [{ text: { content: val } }] };
        if (type === 'number') notionPayload.properties[name] = { number: Number(val) };
        if (type === 'select') notionPayload.properties[name] = { select: { name: val } };
        if (type === 'checkbox') notionPayload.properties[name] = { checkbox: Boolean(val) };
        if (type === 'url') notionPayload.properties[name] = { url: val };
      }
    };

    setProp('Item_Name', payload.Item_Name, 'title');
    setProp('Item_ID', payload.Item_ID, 'rich_text');
    setProp('Base_Price', payload.Base_Price, 'number');
    setProp('Category_ID', payload.Category_ID, 'select');
    setProp('Menu_Type', payload.Menu_Type, 'select');
    setProp('Item_Nature', payload.Item_Nature, 'select');
    setProp('Tax_Tier_ID', payload.Tax_Tier_ID, 'rich_text');
    setProp('Cost_Of_Goods', payload.COGS, 'number');
    setProp('Unit_Stock_Count', payload.Unit_Stock_Count, 'number');
    setProp('Daily_Quota', payload.Daily_Quota, 'number');
    setProp('Low_Stock_Threshold', payload.Low_Stock_Threshold, 'number');
    setProp('Prep_Time_Mins', payload.Prep_Time_Mins, 'number');
    setProp('Recipe_BOM_ID', payload.Recipe_BOM_ID, 'rich_text');
    setProp('Add_Ons_Allowed', payload.Add_Ons_Allowed, 'rich_text');
    setProp('Is_Active', payload.Is_Active, 'checkbox');
    setProp('Image_URL', payload.Image_URL, 'url');

    try {
      const endpoint = CORS_PROXY + encodeURIComponent(editingItemId 
        ? \`https://api.notion.com/v1/pages/\${editingItemId}\` 
        : \`https://api.notion.com/v1/pages\`);
      const method = editingItemId ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': \`Bearer \${NOTION_TOKEN}\`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest'
        },
        body: JSON.stringify(notionPayload)
      });
      
      const data = await res.json();
      
      if (!res.ok || data.object === 'error') {
        alert("Error saving item: " + (data.message || "Unknown error"));
      } else {
        closePanel();
        await fetchMenuData(); 
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      saveBtn.innerText = 'Save';
      saveBtn.disabled = false;
    }
  });
}
`;

const jsOldPayloadStart = js.indexOf('const payload = {');
const jsOldPayloadEnd = js.indexOf('  });\n}', jsOldPayloadStart) + 6;
js = js.substring(0, jsOldPayloadStart) + jsPatch + js.substring(jsOldPayloadEnd);

// Also remove file upload handler logic
js = js.replace(/const fileInput = document.getElementById\('Image_Upload'\);[\s\S]*?\}\);/m, '');

// Pre-fill image URL when editing
js = js.replace(/if \(p\.Unit_Stock_Count\?\.number !== undefined\) document.getElementById\('Unit_Stock_Count'\)\.value = p\.Unit_Stock_Count\.number;/g, 
  "if (p.Unit_Stock_Count?.number !== undefined) document.getElementById('Unit_Stock_Count').value = p.Unit_Stock_Count.number;\n  if (p.Image_URL?.url) document.getElementById('Image_URL').value = p.Image_URL.url;"
);

fs.writeFileSync('public/script.js', js);

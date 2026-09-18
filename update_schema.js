const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) process.env[key.trim()] = values.join('=').trim();
});

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

async function updateSchema() {
  const payload = {
    properties: {
      "Base_Price": { number: { format: "number" } },
      "Item_ID": { rich_text: {} },
      "Category_ID": { select: { options: [] } },
      "Menu_Type": { select: { options: [{name: "Veg"}, {name: "Non-Veg"}, {name: "Vegan"}, {name: "Egg"}] } },
      "Item_Nature": { select: { options: [{name: "Made-To-Order"}, {name: "Pre-Made"}, {name: "Sub-Assembly"}] } },
      "Tax_Tier_ID": { rich_text: {} },
      "Cost_Of_Goods": { number: { format: "number" } },
      "Unit_Stock_Count": { number: { format: "number" } },
      "Daily_Quota": { number: { format: "number" } },
      "Low_Stock_Threshold": { number: { format: "number" } },
      "Prep_Time_Mins": { number: { format: "number" } },
      "Recipe_BOM_ID": { rich_text: {} },
      "Add_Ons_Allowed": { rich_text: {} },
      "Is_Active": { checkbox: {} },
      "Image_URL": { url: {} }
    }
  };

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.error) {
      console.error("Failed to update schema:", data.error);
    } else {
      console.log("Notion database schema updated successfully!");
    }
  } catch(e) {
    console.error(e);
  }
}

updateSchema();

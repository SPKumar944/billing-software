const https = require('https');
const NOTION_TOKEN = 'ntn_REDACTED_API_TOKEN_XYZj5';
const NOTION_DB_ID = '3cffc44d958c809dbeafc83e4f9e9f31';

const categories = [
  "Hollow Crisp Shells",
  "Flat Crisps & Edible Tart Bases",
  "Puffed Grain & Light Mixes",
  "Griddle-Fried Patties & Warm Cutlet Chaats",
  "Stuffed Pastries & Giant Kachoris",
  "Yogurt-Soaked Lentil Dumplings",
  "Crispy Battered Leaf & Fried Veg Chaats",
  "Boiled Legumes Sprouts & Protein Bases",
  "Roasted Roots & Fresh Fruit Chaats",
  "Regional Specialties",
  "Fusion & Modern Chaats"
];

const payload = JSON.stringify({
  properties: {
    "Category_ID": {
      select: {
        options: categories.map(name => ({ name }))
      }
    }
  }
});

const req = https.request(`https://api.notion.com/v1/databases/${NOTION_DB_ID}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});
req.write(payload);
req.end();

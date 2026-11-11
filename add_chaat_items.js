const https = require('https');

const TOKEN = process.env.NOTION_TOKEN || '';
const DB_ID = '3cffc44d958c809dbeafc83e4f9e9f31';

const chaatItems = [
  {
    name: "Samosa Chaat", price: 80, category: "Fusion & Modern Chaats",
    ingredients: [
      { ingredient: "Samosa", qty: 1, unit: "pcs" },
      { ingredient: "Chole (Chickpea Curry)", qty: 100, unit: "g" },
      { ingredient: "Yogurt (Dahi)", qty: 50, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 20, unit: "g" },
      { ingredient: "Mint Coriander Chutney", qty: 15, unit: "g" },
      { ingredient: "Onion", qty: 20, unit: "g" },
      { ingredient: "Tomato", qty: 15, unit: "g" },
      { ingredient: "Sev", qty: 10, unit: "g" },
      { ingredient: "Chaat Masala", qty: 2, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 2, unit: "g" }
    ]
  },
  {
    name: "Pani Puri (Gol Gappa)", price: 50, category: "Regional Specialties",
    ingredients: [
      { ingredient: "Puri Shells", qty: 6, unit: "pcs" },
      { ingredient: "Potatoes (boiled)", qty: 40, unit: "g" },
      { ingredient: "Black Chickpeas", qty: 20, unit: "g" },
      { ingredient: "Teekha Pani (Spicy Water)", qty: 150, unit: "ml" },
      { ingredient: "Meetha Pani (Sweet Water)", qty: 50, unit: "ml" },
      { ingredient: "Onion", qty: 10, unit: "g" },
      { ingredient: "Chaat Masala", qty: 1, unit: "g" }
    ]
  },
  {
    name: "Bhel Puri", price: 60, category: "Regional Specialties",
    ingredients: [
      { ingredient: "Puffed Rice (Kurmura)", qty: 40, unit: "g" },
      { ingredient: "Sev", qty: 20, unit: "g" },
      { ingredient: "Papdi", qty: 3, unit: "pcs" },
      { ingredient: "Onion", qty: 25, unit: "g" },
      { ingredient: "Tomato", qty: 25, unit: "g" },
      { ingredient: "Potatoes (boiled)", qty: 30, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 20, unit: "g" },
      { ingredient: "Garlic Chutney", qty: 10, unit: "g" },
      { ingredient: "Mint Chutney", qty: 10, unit: "g" },
      { ingredient: "Raw Mango", qty: 10, unit: "g" },
      { ingredient: "Chaat Masala", qty: 2, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 3, unit: "g" }
    ]
  },
  {
    name: "Aloo Tikki Chaat", price: 90, category: "Roasted Roots & Fresh Fruit Chaats",
    ingredients: [
      { ingredient: "Aloo Tikki", qty: 2, unit: "pcs" },
      { ingredient: "Chole (Chickpea Curry)", qty: 80, unit: "g" },
      { ingredient: "Yogurt (Dahi)", qty: 40, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 20, unit: "g" },
      { ingredient: "Mint Chutney", qty: 15, unit: "g" },
      { ingredient: "Onion", qty: 20, unit: "g" },
      { ingredient: "Sev", qty: 10, unit: "g" },
      { ingredient: "Chaat Masala", qty: 2, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 2, unit: "g" }
    ]
  },
  {
    name: "Papdi Chaat", price: 70, category: "Flat Crisps & Edible Tart Bases",
    ingredients: [
      { ingredient: "Papdi", qty: 6, unit: "pcs" },
      { ingredient: "Potatoes (boiled)", qty: 40, unit: "g" },
      { ingredient: "Sprouted Moong", qty: 20, unit: "g" },
      { ingredient: "Yogurt (Dahi)", qty: 60, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 20, unit: "g" },
      { ingredient: "Mint Chutney", qty: 15, unit: "g" },
      { ingredient: "Chaat Masala", qty: 2, unit: "g" },
      { ingredient: "Roasted Cumin Powder", qty: 1, unit: "g" },
      { ingredient: "Red Chilli Powder", qty: 1, unit: "g" },
      { ingredient: "Sev", qty: 15, unit: "g" },
      { ingredient: "Pomegranate Seeds", qty: 10, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 2, unit: "g" }
    ]
  },
  {
    name: "Dahi Vada", price: 80, category: "Boiled Legumes Sprouts & Protein Bases",
    ingredients: [
      { ingredient: "Urad Dal Vada", qty: 2, unit: "pcs" },
      { ingredient: "Yogurt (Sweetened)", qty: 100, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 20, unit: "g" },
      { ingredient: "Mint Chutney", qty: 10, unit: "g" },
      { ingredient: "Roasted Cumin Powder", qty: 2, unit: "g" },
      { ingredient: "Black Salt", qty: 1, unit: "g" },
      { ingredient: "Red Chilli Powder", qty: 1, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 2, unit: "g" }
    ]
  },
  {
    name: "Sev Puri", price: 60, category: "Flat Crisps & Edible Tart Bases",
    ingredients: [
      { ingredient: "Flat Puris (Papdi)", qty: 6, unit: "pcs" },
      { ingredient: "Potatoes (boiled)", qty: 50, unit: "g" },
      { ingredient: "Onion", qty: 30, unit: "g" },
      { ingredient: "Tomato", qty: 20, unit: "g" },
      { ingredient: "Garlic Chutney", qty: 10, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 25, unit: "g" },
      { ingredient: "Mint Chutney", qty: 15, unit: "g" },
      { ingredient: "Nylon Sev", qty: 30, unit: "g" },
      { ingredient: "Raw Mango", qty: 10, unit: "g" },
      { ingredient: "Chaat Masala", qty: 2, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 3, unit: "g" }
    ]
  },
  {
    name: "Raj Kachori", price: 120, category: "Flat Crisps & Edible Tart Bases",
    ingredients: [
      { ingredient: "Raj Kachori Shell", qty: 1, unit: "pcs" },
      { ingredient: "Potatoes (boiled)", qty: 30, unit: "g" },
      { ingredient: "Sprouted Moong", qty: 20, unit: "g" },
      { ingredient: "Boiled Chickpeas", qty: 20, unit: "g" },
      { ingredient: "Yogurt (Sweetened)", qty: 80, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 30, unit: "g" },
      { ingredient: "Mint Chutney", qty: 20, unit: "g" },
      { ingredient: "Sev", qty: 15, unit: "g" },
      { ingredient: "Pomegranate Seeds", qty: 15, unit: "g" },
      { ingredient: "Chaat Masala", qty: 3, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 3, unit: "g" }
    ]
  },
  {
    name: "Chana Chaat", price: 60, category: "Boiled Legumes Sprouts & Protein Bases",
    ingredients: [
      { ingredient: "Kabuli Chana (boiled)", qty: 100, unit: "g" },
      { ingredient: "Onion", qty: 30, unit: "g" },
      { ingredient: "Tomato", qty: 30, unit: "g" },
      { ingredient: "Cucumber", qty: 20, unit: "g" },
      { ingredient: "Green Chilli", qty: 2, unit: "g" },
      { ingredient: "Lemon Juice", qty: 5, unit: "ml" },
      { ingredient: "Mint Chutney", qty: 10, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 10, unit: "g" },
      { ingredient: "Chaat Masala", qty: 2, unit: "g" },
      { ingredient: "Roasted Cumin Powder", qty: 1, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 3, unit: "g" }
    ]
  },
  {
    name: "Masala Puri", price: 70, category: "Regional Specialties",
    ingredients: [
      { ingredient: "Crushed Puris", qty: 6, unit: "pcs" },
      { ingredient: "Ragda (White Peas Curry)", qty: 120, unit: "g" },
      { ingredient: "Onion", qty: 25, unit: "g" },
      { ingredient: "Tomato", qty: 15, unit: "g" },
      { ingredient: "Sev", qty: 20, unit: "g" },
      { ingredient: "Tamarind Chutney", qty: 15, unit: "g" },
      { ingredient: "Mint Chutney", qty: 10, unit: "g" },
      { ingredient: "Chaat Masala", qty: 2, unit: "g" },
      { ingredient: "Coriander Leaves", qty: 3, unit: "g" }
    ]
  }
];

function createItem(item, idx) {
  return new Promise((resolve, reject) => {
    const bomPayload = {
      ingredients: item.ingredients,
      dailyQuotas: { "Mon": 10, "Tue": 15, "Wed": 12, "Thu": 20, "Fri": 35, "Sat": 50, "Sun": 45 }
    };
    
    const data = JSON.stringify({
      parent: { database_id: DB_ID },
      properties: {
        "Name": { title: [{ text: { content: item.name } }] },
        "Item_ID": { rich_text: [{ text: { content: "CHAAT-" + (100 + idx) } }] },
        "Base_Price": { number: item.price },
        "Category_ID": { select: { name: item.category } },
        "Menu_Type": { select: { name: "Veg" } },
        "Item_Nature": { select: { name: "Made-To-Order" } },
        "Recipe_BOM_ID": { rich_text: [{ text: { content: JSON.stringify(bomPayload) } }] },
        "Is_Active": { checkbox: true }
      }
    });

    const options = {
      hostname: 'api.notion.com',
      path: '/v1/pages',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`Created: ${item.name}`);
          resolve();
        } else {
          console.error(`Failed to create ${item.name}: ${responseBody}`);
          reject(responseBody);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function run() {
  for (let i = 0; i < chaatItems.length; i++) {
    await createItem(chaatItems[i], i);
    await new Promise(r => setTimeout(r, 500)); // rate limiting
  }
}

run();

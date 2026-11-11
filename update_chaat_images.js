const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOKEN = process.env.NOTION_TOKEN || '';
const DB_ID = '3cffc44d958c809dbeafc83e4f9e9f31';

// Reliable Wikimedia Commons URLs for Chaat
const chaatImages = {
  "Samosa Chaat": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Samosa_chaat.jpg",
  "Pani Puri (Gol Gappa)": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Panipuri_1.jpg",
  "Bhel Puri": "https://upload.wikimedia.org/wikipedia/commons/7/77/Bhel_Puri_Mumbai.jpg",
  "Aloo Tikki Chaat": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Aloo_Tikki_Chaat.jpg",
  "Papdi Chaat": "https://upload.wikimedia.org/wikipedia/commons/9/90/Papdi_Chaat_2.jpg",
  "Dahi Vada": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Dahi_vada_2.jpg",
  "Sev Puri": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Sev_Puri_Mumbai.jpg",
  "Raj Kachori": "https://upload.wikimedia.org/wikipedia/commons/6/69/Raj_Kachori.jpg",
  "Chana Chaat": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Chana_chaat.jpg",
  "Masala Puri": "https://upload.wikimedia.org/wikipedia/commons/8/87/Masalapuri.jpg"
};

async function getPages() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({});
    const options = {
      hostname: 'api.notion.com',
      path: '/v1/databases/' + DB_ID + '/query',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body).results));
    });
    req.write(data);
    req.end();
  });
}

function updatePage(pageId, imageUrl) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      properties: {
        "Image_URL": { url: imageUrl }
      }
    });
    const options = {
      hostname: 'api.notion.com',
      path: '/v1/pages/' + pageId,
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      }
    };
    const req = https.request(options, res => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.write(data);
    req.end();
  });
}

async function run() {
  const pages = await getPages();
  for (const page of pages) {
    const name = page.properties.Name.title[0]?.plain_text;
    if (chaatImages[name]) {
      console.log('Downloading image for ' + name);
      const filename = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
      const localPath = path.join(__dirname, 'public', 'uploads', filename);
      
      try {
        // Download using curl to follow redirects if necessary
        execSync(`curl -L -s "${chaatImages[name]}" -o "${localPath}"`);
        
        // Update Notion to point to the local url
        const localUrl = `http://localhost:3000/uploads/${filename}`;
        await updatePage(page.id, localUrl);
        console.log('Updated ' + name);
      } catch (e) {
        console.error('Failed on ' + name, e.message);
      }
    }
  }
}

run();

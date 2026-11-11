const https = require('https');

const TOKEN = process.env.NOTION_TOKEN || '';
const DB_ID = '3cffc44d958c809dbeafc83e4f9e9f31';

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

function removeImage(pageId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      properties: {
        "Image_URL": null,
        "Images": null
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
    if (name && (name.includes('Chaat') || name.includes('Puri') || name.includes('Vada') || name.includes('Kachori'))) {
      await removeImage(page.id);
      console.log('Removed image from ' + name);
    }
  }
}

run();

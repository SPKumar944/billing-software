const https = require('https');
const NOTION_TOKEN = 'ntn_REDACTED_API_TOKEN_XYZj5';
const NOTION_DB_ID = '3cffc44d958c809dbeafc83e4f9e9f31';

const payload = JSON.stringify({
  properties: {
    Images: { files: {} }
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

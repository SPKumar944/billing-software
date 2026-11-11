const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target = `    const json = await res.json();
    const records = json.data;
    
    // Group records by YYYY-MM
    const recordsByMonth = {};
    records.forEach(r => {
      const date = r.properties.Timestamp.date.start.substring(0, 10); // YYYY-MM-DD
      const ym = date.substring(0, 7); // YYYY-MM
      if (!recordsByMonth[ym]) recordsByMonth[ym] = [];
      recordsByMonth[ym].push({
        date: date,
        status: r.properties.Status.select.name
      });
    });`;

const replacement = `    const records = await res.json();
    
    // Group records by YYYY-MM
    const recordsByMonth = {};
    records.forEach(r => {
      if (!r.timestamp) return; // safety check
      const date = r.timestamp.substring(0, 10); // YYYY-MM-DD
      const ym = date.substring(0, 7); // YYYY-MM
      if (!recordsByMonth[ym]) recordsByMonth[ym] = [];
      recordsByMonth[ym].push({
        date: date,
        status: r.status
      });
    });`;

script = script.replace(target, replacement);
fs.writeFileSync('public/script.js', script);
console.log("Fixed payload parsing bug!");

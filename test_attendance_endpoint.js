const http = require('http');
http.get('http://localhost:3000/api/attendance/3dffc44d-958c-81d4-a60f-cf84e662a67a?year=2026&month=09', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Response:", data);
  });
});

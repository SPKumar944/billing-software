const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const target = `const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}/\`);
});`;

const replacement = `if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(\`Server running at http://localhost:\${PORT}/\`);
  });
}

module.exports = server;`;

server = server.replace(target, replacement);
fs.writeFileSync('server.js', server);
console.log("Updated server.js for Vercel!");

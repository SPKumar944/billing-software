const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target = `imageUrl = p.Images.files[0].external ? p.Images.files[0].external.url : p.Images.files[0].file.url;
      } else if (p.Image_URL?.url) {
        imageUrl = p.Image_URL.url;
      }`;

const replacement = `imageUrl = p.Images.files[0].external ? p.Images.files[0].external.url : p.Images.files[0].file.url;
      } else if (p.Image_URL?.url) {
        imageUrl = p.Image_URL.url;
      }
      
      // FIX for Vercel: rewrite localhost image URLs to relative paths so they load on any domain
      if (imageUrl && imageUrl.includes('localhost:3000')) {
        imageUrl = imageUrl.replace('http://localhost:3000', '');
      }`;

script = script.replace(target, replacement);
fs.writeFileSync('public/script.js', script);
console.log("Patched localhost image URLs!");

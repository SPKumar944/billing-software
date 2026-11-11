const fs = require('fs');
let script = fs.readFileSync('public/script.js', 'utf8');

const target = `  html2pdf().set(opt).from(element).save().then(() => {
    element.style.display = 'none';
  });
};
  
  html2pdf().set(opt).from(element).save().then(() => {
    // Hide it again
    element.style.display = 'none';
  });
};`;

const replacement = `  html2pdf().set(opt).from(element).save().then(() => {
    element.style.display = 'none';
  });
};`;

script = script.replace(target, replacement);
fs.writeFileSync('public/script.js', script);
console.log("Fixed syntax error!");

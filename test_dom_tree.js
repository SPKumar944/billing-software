const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

function printPath(element) {
  let path = [];
  let current = element;
  while (current && current.tagName) {
    path.unshift(current.tagName.toLowerCase() + (current.id ? '#' + current.id : '') + (current.className ? '.' + current.className.split(' ').join('.') : ''));
    current = current.parentNode;
  }
  return path.join(' > ');
}

const dirView = document.getElementById('employee-directory-view');
console.log("Path to dirView:");
console.log(printPath(dirView));

const profView = document.getElementById('employee-profile-view');
console.log("Path to profView:");
console.log(printPath(profView));


const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const document = dom.window.document;
let el = document.getElementById('wisdomBox');
let path = [];
while (el) {
  let id = el.id ? '#' + el.id : '';
  let cls = el.className ? '.' + el.className.split(' ').join('.') : '';
  path.unshift(el.tagName + id + cls);
  el = el.parentElement;
}
console.log(path.join('\n  -> '));

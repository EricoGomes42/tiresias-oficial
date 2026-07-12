const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const document = dom.window.document;
const wb = document.getElementById('wisdomBox');
console.log(wb.parentNode.tagName);
console.log(wb.parentNode.className);
console.log(wb.parentNode.id);

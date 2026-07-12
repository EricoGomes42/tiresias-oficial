const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const document = dom.window.document;
const wisdomBox = document.getElementById('wisdomBox');
console.log(wisdomBox.parentNode.tagName);
console.log(wisdomBox.parentNode.className);

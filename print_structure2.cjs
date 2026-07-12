const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');

function printDOMTree(html) {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    let path = [];
    let current = document.getElementById('wisdomBox');
    while(current && current !== document.body) {
        let idAttr = current.id ? '#' + current.id : '';
        let classAttr = (typeof current.className === 'string' && current.className) ? '.' + current.className.replace(/\s+/g, '.') : '';
        path.unshift(current.tagName.toLowerCase() + idAttr + classAttr);
        current = current.parentNode;
    }
    console.log("Path to wisdomBox:");
    path.forEach((p, i) => console.log('  '.repeat(i) + p));
}
printDOMTree(html);

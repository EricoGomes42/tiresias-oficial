const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');

function printDOMTree(html) {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    function walk(node, depth) {
        if (node.nodeType === 1) { // Element node
            let idAttr = node.id ? '#' + node.id : '';
            let classAttr = node.className ? '.' + node.className.replace(/\s+/g, '.') : '';
            console.log('  '.repeat(depth) + node.tagName.toLowerCase() + idAttr + classAttr);
            
            // stop if it's too deep or we found what we want
            if (node.id === 'wisdomBox' || depth > 10) return;
            
            for (let child of node.children) {
                walk(child, depth + 1);
            }
        }
    }
    
    walk(document.body, 0);
}
printDOMTree(html);

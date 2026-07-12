const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace(
    'body.state-revealed .wisdom-box {\n        width: 100vw !important;',
    'body.state-revealed .wisdom-box {\n        position: fixed !important;\n        width: 100vw !important;'
);

fs.writeFileSync('index.html', html);
console.log("Added position: fixed !important to global block");

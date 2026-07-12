const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace('font-size: 10px !important;', 'font-size: 9px !important;');
html = html.replace('line-height: 1 !important;', 'line-height: 1.2 !important;');
html = html.replace('white-space: nowrap !important;', 'white-space: normal !important;\n          text-align: center !important;');

fs.writeFileSync('index.html', html);
console.log("Fixed mobile button text breaking");

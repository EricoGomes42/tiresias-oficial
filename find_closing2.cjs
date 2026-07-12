const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const lines = html.split('\n');

let openTags = 0;
let started = false;

for (let i = 2723; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<div')) {
        let matches = line.match(/<div/g);
        openTags += matches ? matches.length : 0;
        started = true;
    }
    if (line.includes('</div')) {
        let matches = line.match(/<\/div/g);
        openTags -= matches ? matches.length : 0;
    }
    if (started && openTags <= 0) {
        console.log('Closing tag for mobile-only is at line:', i + 1);
        break;
    }
}

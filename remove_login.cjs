const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<!-- Login Button -->[\s\S]*?<\/button>\s*/, '');
html = html.replace('<script type="module" src="./firebase_setup.js"></script>', '');

fs.writeFileSync('index.html', html);
console.log('Login button and firebase script removed.');

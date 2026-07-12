const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace('        align-items: center !important;', '');
html = html.replace('        justify-content: center !important;', '');

// Let's ensure wisdom-text is centered vertically by auto margins.
// Currently:
//       body.state-revealed .wisdom-text {
//         text-align: center;
//         width: 100%;
//         max-width: 800px;
//         margin: 0 auto auto auto;
//       }
// If we want it centered vertically along with actions, we should have a margin-top: auto on wisdom-text, and margin-bottom: auto on wisdom-actions!
// Let's change wisdom-text margin to: margin: auto auto 0 auto;
// And wisdom-actions to: margin: 40px auto auto auto;

html = html.replace('        margin: 0 auto auto auto;', '        margin: auto auto 0 auto;');

fs.writeFileSync('index.html', html);
console.log("Fixed flexbox scroll issue");

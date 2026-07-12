const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 1. We must replace the media queries that are overriding body.state-revealed .wisdom-box.
// Let's first make body.state-revealed .wisdom-box fully fullscreen in the base CSS.

// Wait, the base CSS doesn't have a body.state-revealed .wisdom-box, it only has it inside @media (max-width: 767px)!
// Let's pull it out and put it at the top of the body.state-revealed section so it applies everywhere!


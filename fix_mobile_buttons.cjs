const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const oldMobile = `        body.state-revealed .wisdom-actions {
          flex-direction: column;
          gap: 12px;
        }
        body.state-revealed .btn-wisdom-action {
          width: 100%;
          max-width: none;
          padding: 16px 20px;
          font-size: 0.75rem;
        }`;

const newMobile = `        body.state-revealed .wisdom-actions {
          flex-direction: column;
          gap: 8px !important;
        }
        body.state-revealed .btn-wisdom-action {
          width: 100%;
          max-width: none;
          padding: 8px 12px !important;
          font-size: 0.65rem !important;
          min-height: 44px !important;
        }`;

if (html.includes(oldMobile)) {
    html = html.replace(oldMobile, newMobile);
    fs.writeFileSync('index.html', html);
    console.log("Updated mobile buttons CSS");
} else {
    console.log("Could not find exact mobile string");
}

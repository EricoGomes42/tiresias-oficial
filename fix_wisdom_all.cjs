const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 1. Remove the old mobile rules for state-revealed wisdom-box
const oldMobile = `        body.state-revealed .wisdom-box {
          width: 100vw;
          height: 100vh;
          max-width: none;
          max-height: none;
          overflow-y: auto;
          padding: max(2rem, env(safe-area-inset-top)) 24px
            max(2rem, env(safe-area-inset-bottom)) 24px;
          background: rgba(8, 10, 24, 0.96);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: none;
          border-radius: 0;
          display: flex;
          flex-direction: column;
        }
        body.state-revealed .wisdom-text {
          margin-top: auto;
          font-size: 1.05rem;
          line-height: 1.6;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        body.state-revealed .wisdom-text::before,
        body.state-revealed .wisdom-text::after {
          margin: 15px 0;
        }
        body.state-revealed .wisdom-actions {
          margin-bottom: auto;
          flex-direction: column;
          gap: 12px;
          margin-top: 30px;
        }
        body.state-revealed .btn-wisdom-action {
          width: 100%;
          padding: 18px 24px;
          font-size: 1rem;
        }`;

if (html.includes(oldMobile)) {
    html = html.replace(oldMobile, '');
    console.log("Removed old mobile wisdom rules");
} else {
    console.log("oldMobile not found, maybe slightly different formatting. Let's use regex.");
}

// 2. Remove the old tablet rules
const oldTablet = `        /* Status box style */
        body.state-revealed .wisdom-box {
          width: 80vw;
          height: 70vh;
          max-width: 600px;
          max-height: 700px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        body.state-revealed .wisdom-box .wisdom-text {
          margin-top: auto;
        }
        body.state-revealed .wisdom-box .wisdom-actions {
          margin-bottom: auto;
          margin-top: 30px;
        }`;

if (html.includes(oldTablet)) {
    html = html.replace(oldTablet, '');
    console.log("Removed old tablet wisdom rules");
}

// 3. Remove the old desktop rules
const oldDesktop = `        body.state-revealed .wisdom-box {
          width: 60vw;
          height: 70vh;
          max-width: 800px;
          max-height: 700px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        body.state-revealed .wisdom-box .wisdom-text {
          margin-top: auto;
        }
        body.state-revealed .wisdom-box .wisdom-actions {
          margin-bottom: auto;
          margin-top: 40px;
        }`;

if (html.includes(oldDesktop)) {
    html = html.replace(oldDesktop, '');
    console.log("Removed old desktop wisdom rules");
}

fs.writeFileSync('index.html', html);

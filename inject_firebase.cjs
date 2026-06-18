const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const loginBtnHTML = `
          <!-- Login Button -->
          <button id="loginBtn" style="
            background: transparent;
            color: rgba(226, 192, 121, 0.8);
            border: 1px solid rgba(226, 192, 121, 0.4);
            border-radius: 8px;
            padding: 4px 12px;
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            backdrop-filter: blur(5px);
            margin-right: 15px;
          ">Login</button>
          <div class="header-lang-wrapper desktop-lang-select">`;

html = html.replace('<div class="header-lang-wrapper desktop-lang-select">', loginBtnHTML);

const scriptInject = `<script type="module" src="./firebase_setup.js"></script>\n</head>`;
html = html.replace('</head>', scriptInject);

fs.writeFileSync('index.html', html);
console.log('Firebase injected');

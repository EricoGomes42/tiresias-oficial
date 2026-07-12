const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const desktopCSS = `
      @media (min-width: 1025px) {
        body.state-revealed .wisdom-box {
          padding: 28px 40px !important;
          justify-content: center !important;
          align-items: center !important;
          overflow: hidden !important;
        }

        body.state-revealed .wisdom-text {
          width: min(88vw, 1180px);
          max-width: 1040px;
          margin: 0 auto;
          font-size: clamp(18px, 1.35vw, 25px);
          line-height: 1.5;
          letter-spacing: 0.055em;
          overflow-y: auto;
          overscroll-behavior: contain;
          max-height: calc(100dvh - 150px);
          text-align: center;
        }

        body.state-revealed .wisdom-sentence {
          margin: 0 0 14px;
        }

        body.state-revealed .wisdom-actions {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 14px !important;
          width: min(88vw, 1180px);
          max-width: 1040px;
          margin: 24px auto 0 auto !important;
        }

        body.state-revealed .btn-wisdom-action {
          min-height: 52px;
          padding: 10px 18px !important;
          font-size: 13px !important;
          letter-spacing: 0.14em !important;
          width: 100% !important;
          max-width: none !important;
        }
      }
`;

html = html.replace('</style>', desktopCSS + '\n    </style>');
fs.writeFileSync('index.html', html);
console.log("Applied Desktop fixes");

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const tabletCSS = `
      @media (min-width: 768px) and (max-width: 1024px) {
        body.state-revealed .wisdom-box {
          padding: clamp(24px, 4vw, 38px) !important;
          justify-content: center !important;
          align-items: center !important;
          overflow: hidden !important;
        }

        body.state-revealed .wisdom-text {
          width: min(92vw, 860px) !important;
          max-width: 760px !important;
          margin: 0 auto !important;
          font-size: clamp(16px, 2.25vw, 22px) !important;
          line-height: 1.55 !important;
          letter-spacing: 0.055em !important;
          text-align: center !important;
          overflow-y: auto !important;
          overscroll-behavior: contain !important;
          max-height: calc(100dvh - 160px) !important;
        }

        body.state-revealed .wisdom-sentence {
          margin: 0 0 clamp(12px, 1.6vh, 18px) !important;
        }

        body.state-revealed .wisdom-actions {
          width: min(92vw, 860px) !important;
          max-width: 760px !important;
          margin: 24px auto 0 !important;
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 12px 14px !important;
        }

        body.state-revealed .btn-wisdom-action {
          width: 100% !important;
          min-height: 50px !important;
          max-height: 58px !important;
          padding: 10px 16px !important;
          border-radius: 999px !important;
          font-size: clamp(11px, 1.5vw, 14px) !important;
          letter-spacing: 0.13em !important;
          max-width: none !important;
        }
      }

      @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
        body.state-revealed .wisdom-box {
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }
        body.state-revealed .wisdom-text {
          max-height: calc(100dvh - 140px) !important;
        }
        body.state-revealed .wisdom-sentence {
          margin-bottom: 10px !important;
        }
        body.state-revealed .wisdom-actions {
          margin-top: 18px !important;
        }
      }
`;

// Append before the last </style>
const lastStyleIndex = html.lastIndexOf('</style>');
if (lastStyleIndex !== -1) {
    html = html.substring(0, lastStyleIndex) + tabletCSS + '\n    </style>' + html.substring(lastStyleIndex + 8);
}

fs.writeFileSync('index.html', html);
console.log("Added Tablet Modal CSS");

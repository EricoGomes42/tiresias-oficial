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
          width: min(88vw, 1180px) !important;
          max-width: 1040px !important;
          margin: 0 auto !important;
          font-size: clamp(18px, 1.35vw, 25px) !important;
          line-height: 1.5 !important;
          letter-spacing: 0.055em !important;
          overflow-y: auto !important;
          overscroll-behavior: contain !important;
          max-height: calc(100dvh - 160px) !important;
          text-align: center !important;
        }

        body.state-revealed .wisdom-sentence {
          margin: 0 0 14px !important;
        }

        body.state-revealed .wisdom-actions {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 14px !important;
          width: min(88vw, 1180px) !important;
          max-width: 1040px !important;
          margin: 24px auto 0 auto !important;
        }

        body.state-revealed .btn-wisdom-action {
          min-height: 52px !important;
          padding: 10px 18px !important;
          font-size: 13px !important;
          letter-spacing: 0.14em !important;
          width: 100% !important;
          max-width: none !important;
        }
      }
`;

// Remove the one I just added
html = html.replace(desktopCSS + '\n    </style>', '</style>');

// Find the last </style>
const lastStyleIndex = html.lastIndexOf('</style>');
if (lastStyleIndex !== -1) {
    html = html.substring(0, lastStyleIndex) + desktopCSS + '\n    </style>' + html.substring(lastStyleIndex + 8);
}

fs.writeFileSync('index.html', html);
console.log("Moved desktop CSS to the end of styles");

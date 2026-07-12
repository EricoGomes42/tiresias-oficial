const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const mobileCSS = `
      @media (max-width: 767px) {
        body.state-revealed .wisdom-actions {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          grid-template-rows: auto auto !important;
          grid-auto-rows: auto !important;
          align-items: center !important;
          gap: 10px !important;
          width: 100% !important;
          max-width: 460px !important;
          margin: 18px auto 0 !important;
        }

        body.state-revealed .btn-wisdom-action {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          width: 100% !important;
          height: 46px !important;
          min-height: 46px !important;
          max-height: 46px !important;

          flex: none !important;
          flex-grow: 0 !important;
          flex-shrink: 0 !important;
          flex-basis: auto !important;

          aspect-ratio: auto !important;
          align-self: center !important;

          padding: 8px 6px !important;
          margin: 0 !important;

          font-size: 10px !important;
          line-height: 1 !important;
          letter-spacing: 0.11em !important;
          white-space: nowrap !important;

          border-radius: 999px !important;
          box-sizing: border-box !important;
        }
      }
`;

// Append before the last </style>
const lastStyleIndex = html.lastIndexOf('</style>');
if (lastStyleIndex !== -1) {
    html = html.substring(0, lastStyleIndex) + mobileCSS + '\n    </style>' + html.substring(lastStyleIndex + 8);
}

fs.writeFileSync('index.html', html);
console.log("Added Mobile Modal CSS at the end");

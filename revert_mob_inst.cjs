const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace(
  'class="w-[297px] max-w-[90vw] h-[125px] border border-[#e2c079]/40 bg-[#0e1526]/10 backdrop-blur-md rounded-none py-5 px-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] mb-[6px] text-[8.5px] sm:text-[10px] tracking-[0.15em] text-[#e2c079] drop-shadow-[0_0_8px_rgba(226,192,121,0.5)] uppercase font-medium leading-[2.2] flex flex-col items-center justify-center"',
  'class="w-[297px] max-w-[90vw] h-[125px] border border-[#e2c079]/40 bg-[#0e1526]/10 backdrop-blur-md rounded-none py-5 px-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] mb-[6px] text-[8.5px] sm:text-[10px] tracking-[0.15em] text-[#e2c079] drop-shadow-[0_0_8px_rgba(226,192,121,0.5)] uppercase font-medium leading-[2.2] flex items-center justify-center"'
);

const mobileCSS = `
      @media (max-width: 767px) {
        #mob-instructionTx {
          flex-direction: column !important;
          gap: 6px !important;
        }
        #mob-instructionTx .limit-sentence {
          width: 100% !important;
          margin-bottom: 0 !important;
          display: block !important;
        }
      }
`;

const lastStyleIndex = html.lastIndexOf('</style>');
if (lastStyleIndex !== -1) {
    html = html.substring(0, lastStyleIndex) + mobileCSS + '\n    </style>' + html.substring(lastStyleIndex + 8);
}

fs.writeFileSync('index.html', html);
console.log("Reverted HTML and added Mobile CSS");

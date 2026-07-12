const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const limitCSS = `
      /* Limit Message Adjustments */
      .instruction.limit-mode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px 18px;
        font-size: 1rem;
        line-height: 1.7;
        letter-spacing: 1.2px;
      }
      
      @media (min-width: 768px) {
        .instruction.limit-mode {
          padding: 1.2rem 1.5rem;
          max-width: 380px; /* Reduced width */
          font-size: 1.05rem;
          line-height: 1.8;
          letter-spacing: 1.3px;
        }
      }
      
      @media (min-width: 1025px) {
        .instruction.limit-mode {
          padding: 1.2rem 2rem;
          max-width: 500px;
          font-size: 1.1rem;
          line-height: 1.8;
          letter-spacing: 1.4px;
        }
      }
`;

html = html.replace('    </style>', limitCSS + '\n    </style>');
fs.writeFileSync("index.html", html);
console.log("Injected limit CSS");

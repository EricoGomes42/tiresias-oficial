const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldLimitCSS = `      /* Limit Message Adjustments */
      .instruction.limit-mode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1rem 1.5rem;
        font-size: 1.05rem;
        line-height: 1.6;
        letter-spacing: 1.2px;
      }
      .limit-sentence {
        display: block;
        margin-bottom: 1rem;
      }
      .limit-sentence:last-child {
        margin-bottom: 0;
      }
      
      /* Tablet */
      @media (min-width: 768px) and (max-width: 1024px) {
        .instruction.limit-mode {
          padding: 1rem 1.5rem;
          max-width: 320px; /* Reduced width to force elegant line breaks */
          font-size: 1rem; /* Slightly reduced font size */
          line-height: 1.65;
          letter-spacing: 1.3px;
        }
        .limit-sentence {
          margin-bottom: 0.9rem;
        }
      }
      
      /* Desktop */
      @media (min-width: 1025px) {
        .instruction.limit-mode {
          padding: 1.1rem 2rem;
          max-width: 380px; /* Reduced width for elegant block */
          font-size: 1.05rem; /* Reduced from 1.1rem */
          line-height: 1.7;
          letter-spacing: 1.4px;
        }
        .limit-sentence {
          margin-bottom: 1.1rem;
        }
      }`;

const newLimitCSS = `      /* Limit Message Adjustments */
      .instruction.limit-mode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px 20px; /* Reduced padding for mobile */
        font-size: 1.05rem;
        line-height: 1.6;
        letter-spacing: 1.2px;
        max-width: 300px;
        margin-left: auto;
        margin-right: auto;
      }
      .limit-sentence {
        display: block;
        margin-bottom: 0.8rem;
      }
      .limit-sentence:last-child {
        margin-bottom: 0;
      }
      
      /* Tablet */
      @media (min-width: 768px) and (max-width: 1024px) {
        .instruction.limit-mode {
          padding: 1rem 1.5rem; /* Reduced from 1.5rem 2rem */
          max-width: 310px; /* Reduced width for lighter block */
          font-size: 0.95rem; /* Slightly reduced font size */
          line-height: 1.7;
          letter-spacing: 1.3px;
        }
        .limit-sentence {
          margin-bottom: 1rem;
        }
      }
      
      /* Desktop */
      @media (min-width: 1025px) {
        .instruction.limit-mode {
          padding: 0.9rem 1.8rem; /* Reduced padding from 1rem 2rem */
          max-width: 360px; /* Reduced width for vertical elegance */
          font-size: 1rem; /* Reduced from 1.1rem */
          line-height: 1.75;
          letter-spacing: 1.4px;
        }
        .limit-sentence {
          margin-bottom: 1.1rem;
        }
      }`;

html = html.replace(oldLimitCSS, newLimitCSS);
fs.writeFileSync("index.html", html);
console.log("Tweaked limit css");

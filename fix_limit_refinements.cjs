const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

// Replace the formatFn we previously injected
const oldFormatFn = `      window.formatLimitMessage = function(msg) {
        if (!msg) return "";
        let formatted = msg.replace(/\\.\\s+/g, '.<br><br>');
        return formatted;
      };`;

const newFormatFn = `      window.formatLimitMessage = function(msg) {
        if (!msg) return "";
        let sentences = msg.split('. ').filter(s => s.trim().length > 0);
        return sentences.map(s => \`<span class="limit-sentence">\${s}\${s.endsWith('.') ? '' : '.'}</span>\`).join('');
      };`;

html = html.replace(oldFormatFn, newFormatFn);

// Replace the limitCSS we previously injected
const oldLimitCSS = `      /* Limit Message Adjustments */
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
      }`;

const newLimitCSS = `      /* Limit Message Adjustments */
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

html = html.replace(oldLimitCSS, newLimitCSS);
fs.writeFileSync("index.html", html);
console.log("Updated format limit msg and css");

const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldLimitCSS = `      /* Limit Message Adjustments */
      .instruction.limit-mode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 8px 16px;
        font-size: 0.95rem;
        line-height: 1.5;
        letter-spacing: 1.1px;
        max-width: 280px;
        margin-left: auto;
        margin-right: auto;
      }
      .limit-sentence {
        display: block;
        margin-bottom: 0.7rem;
      }
      .limit-sentence:last-child {
        margin-bottom: 0;
      }
      
      /* Tablet */
      @media (min-width: 768px) and (max-width: 1024px) {
        .instruction.limit-mode {
          padding: 0.8rem 1.2rem;
          max-width: 280px;
          font-size: 0.9rem;
          line-height: 1.6;
          letter-spacing: 1.2px;
        }
        .limit-sentence {
          margin-bottom: 0.8rem;
        }
      }
      
      /* Desktop */
      @media (min-width: 1025px) {
        .instruction.limit-mode {
          padding: 0.75rem 1.5rem;
          max-width: 320px;
          font-size: 0.9rem;
          line-height: 1.65;
          letter-spacing: 1.3px;
        }
        .limit-sentence {
          margin-bottom: 0.9rem;
        }
      }`;

const newLimitCSS = `      /* Limit Message Adjustments (Refined for Western Languages) */
      .instruction.limit-mode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 7px 14px;
        font-size: 0.86rem;
        line-height: 1.45;
        letter-spacing: 1.1px;
        max-width: 270px;
        margin-left: auto;
        margin-right: auto;
      }
      .limit-sentence {
        display: block;
        margin-bottom: 0.65rem;
      }
      .limit-sentence:last-child {
        margin-bottom: 0;
      }
      
      /* Tablet */
      @media (min-width: 768px) and (max-width: 1024px) {
        .instruction.limit-mode {
          padding: 0.7rem 1.1rem;
          max-width: 270px;
          font-size: 0.82rem;
          line-height: 1.55;
          letter-spacing: 1.2px;
        }
        .limit-sentence {
          margin-bottom: 0.75rem;
        }
      }
      
      /* Desktop */
      @media (min-width: 1025px) {
        .instruction.limit-mode {
          padding: 0.65rem 1.3rem;
          max-width: 300px;
          font-size: 0.82rem;
          line-height: 1.6;
          letter-spacing: 1.3px;
        }
        .limit-sentence {
          margin-bottom: 0.8rem;
        }
      }

      /* Asian Languages Preserved Sizes */
      html[lang="ja"] .instruction.limit-mode,
      html[lang="ko"] .instruction.limit-mode,
      html[lang="zh"] .instruction.limit-mode {
        padding: 8px 16px;
        font-size: 0.95rem;
        max-width: 280px;
        line-height: 1.5;
      }
      html[lang="ja"] .limit-sentence,
      html[lang="ko"] .limit-sentence,
      html[lang="zh"] .limit-sentence {
        margin-bottom: 0.7rem;
      }

      @media (min-width: 768px) and (max-width: 1024px) {
        html[lang="ja"] .instruction.limit-mode,
        html[lang="ko"] .instruction.limit-mode,
        html[lang="zh"] .instruction.limit-mode {
          padding: 0.8rem 1.2rem;
          max-width: 280px;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        html[lang="ja"] .limit-sentence,
        html[lang="ko"] .limit-sentence,
        html[lang="zh"] .limit-sentence {
          margin-bottom: 0.8rem;
        }
      }

      @media (min-width: 1025px) {
        html[lang="ja"] .instruction.limit-mode,
        html[lang="ko"] .instruction.limit-mode,
        html[lang="zh"] .instruction.limit-mode {
          padding: 0.75rem 1.5rem;
          max-width: 320px;
          font-size: 0.9rem;
          line-height: 1.65;
        }
        html[lang="ja"] .limit-sentence,
        html[lang="ko"] .limit-sentence,
        html[lang="zh"] .limit-sentence {
          margin-bottom: 0.9rem;
        }
      }`;

if (html.includes(oldLimitCSS)) {
  html = html.replace(oldLimitCSS, newLimitCSS);
  fs.writeFileSync("index.html", html);
  console.log("Replaced limit CSS successfully");
} else {
  console.log("Could not find the old CSS!");
}

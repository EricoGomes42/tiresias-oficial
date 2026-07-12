const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');

const newCSS = `
      /* --- FULLSCREEN WISDOM OVERLAY (ALL DEVICES) --- */
      body.state-revealed .wisdom-box {
        width: 100vw !important;
        height: 100vh !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
        max-width: none !important;
        max-height: none !important;
        border-radius: 0 !important;
        border: none !important;
        margin: 0 !important;
        padding: max(4rem, env(safe-area-inset-top)) 10% max(4rem, env(safe-area-inset-bottom)) 10% !important;
        background: rgba(14, 21, 38, 0.98) !important;
        backdrop-filter: blur(40px) saturate(1.2) !important;
        -webkit-backdrop-filter: blur(40px) saturate(1.2) !important;
        z-index: 999999 !important; /* Above everything */
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        overflow-y: auto !important;
      }

      /* Sentences logic */
      body.state-revealed .wisdom-text {
        text-align: center;
        width: 100%;
        max-width: 800px;
        margin: 0 auto auto auto;
      }
      
      .wisdom-sentence {
        display: block;
        margin-bottom: 1.5rem;
        font-size: 1.15rem;
        line-height: 1.6;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      }
      .wisdom-sentence:last-child {
        margin-bottom: 0;
      }
      
      body.state-revealed .wisdom-actions {
        width: 100%;
        max-width: 800px;
        margin: 40px auto auto auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
      }
      
      body.state-revealed .btn-wisdom-action {
        flex: 1 1 200px;
        max-width: 250px;
        padding: 18px 24px;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
      }

      @media (max-width: 767px) {
        body.state-revealed .wisdom-box {
          padding: max(2rem, env(safe-area-inset-top)) 24px max(2rem, env(safe-area-inset-bottom)) 24px !important;
        }
        .wisdom-sentence {
          font-size: 1rem;
          margin-bottom: 1.2rem;
          text-align: left;
        }
        body.state-revealed .wisdom-actions {
          flex-direction: column;
          gap: 12px;
        }
        body.state-revealed .btn-wisdom-action {
          width: 100%;
          max-width: none;
          padding: 16px 20px;
          font-size: 0.75rem;
        }
      }
`;

const splitString = "      /* Oculta botão primário e introdução quando abrir oráculo */";
if (html.includes(splitString)) {
    const newHtml = html.replace(splitString, newCSS + '\n' + splitString);
    fs.writeFileSync('index.html', newHtml);
    console.log("Inserted new CSS successfully");
} else {
    console.log("Could not find split string");
}

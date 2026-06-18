const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const bannerCSS = `
      .cookie-banner {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        background: rgba(10, 11, 22, 0.85);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 15px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      @media (min-width: 768px) {
        .cookie-banner {
          flex-direction: row;
          padding: 15px 25px;
        }
      }
      .cookie-banner.show {
        bottom: 20px;
        opacity: 1;
      }
      .cookie-banner p {
        font-size: 0.8rem;
        color: rgba(245, 245, 247, 0.8);
        margin: 0;
        line-height: 1.4;
        text-align: center;
      }
      @media (min-width: 768px) {
        .cookie-banner p {
          text-align: left;
        }
      }
      .cookie-banner button {
        background: transparent;
        border: 1px solid rgba(226, 192, 121, 0.5);
        color: var(--gold-champagne);
        padding: 8px 20px;
        border-radius: 8px;
        font-size: 0.75rem;
        letter-spacing: 1px;
        cursor: pointer;
        text-transform: uppercase;
        transition: all 0.3s ease;
        white-space: nowrap;
      }
      .cookie-banner button:hover {
        background: rgba(226, 192, 121, 0.1);
        border-color: rgba(226, 192, 121, 0.8);
      }
`;

const bannerHTML = `
    <div id="cookieBanner" class="cookie-banner">
      <p id="cookieText">We use cookies to provide a better experience. By continuing, you agree to our Privacy Policy.</p>
      <button id="cookieBtn" onclick="acceptCookies()">Got it</button>
    </div>
    <!-- Elementos de Áudio -->`;

const translations = {
  pt: { cookieText: "Utilizamos cookies e tecnologias semelhantes para oferecer uma melhor experiência. Ao continuar, você concorda com nossa Política de Privacidade.", cookieBtn: "Aceitar" },
  en: { cookieText: "We use cookies to provide a better experience. By continuing, you agree to our Privacy Policy.", cookieBtn: "Got it" },
  es: { cookieText: "Utilizamos cookies para ofrecer una mejor experiencia. Al continuar, acepta nuestra Política de Privacidad.", cookieBtn: "Aceptar" },
  fr: { cookieText: "Nous utilisons des cookies pour vous offrir une meilleure expérience. En continuant, vous acceptez notre Politique de confidentialité.", cookieBtn: "Compris" },
  de: { cookieText: "Wir verwenden Cookies für ein besseres Erlebnis. Indem Sie fortfahren, stimmen Sie unserer Datenschutzrichtlinie zu.", cookieBtn: "Verstanden" },
  it: { cookieText: "Utilizziamo i cookie per offrirti un'esperienza migliore. Continuando, accetti la nostra Informativa sulla privacy.", cookieBtn: "Ho capito" }
};

// Map languages
const fallbacks = ["ja", "ko", "zh", "hi", "ar", "ru", "tr", "nl", "pl", "uk", "id"];
for (const lang of fallbacks) {
  translations[lang] = translations.en; 
}

// 1. Inject CSS
html = html.replace('/* Modais Cinematográficos Fullscreen */', bannerCSS + '\n      /* Modais Cinematográficos Fullscreen */');

// 2. Inject HTML
html = html.replace('<!-- Elementos de Áudio -->', bannerHTML);

// 3. Inject translations
const regex = /const i18n = (\{[\s\S]*?\n\s{6}\});\n/m;
const match = html.match(regex);
if (match) {
  let i18nObj = new Function('return ' + match[1])();
  for (let lang of Object.keys(i18nObj)) {
    let trans = translations[lang] || translations.en;
    i18nObj[lang].cookieText = trans.cookieText;
    i18nObj[lang].cookieBtn = trans.cookieBtn;
  }
  const serialized = JSON.stringify(i18nObj, null, 2);
  html = html.replace(match[0], "const i18n = " + serialized + ";\n");
}

// 4. Inject script logic
const jsLogic = `
        const bText = document.getElementById("cookieText"); if (bText) bText.innerText = t.cookieText;
        const bBtn = document.getElementById("cookieBtn"); if (bBtn) bBtn.innerText = t.cookieBtn;

        document.querySelectorAll("a[onclick*='modalBlog']").forEach(e => e.innerText = t.blog);
`;

html = html.replace(/document\.querySelectorAll\("a\[onclick\*='modalBlog'\]"\)\.forEach\(e => e\.innerText = t\.blog\);/, jsLogic);

const jsAccept = `
      window.acceptCookies = function() {
        localStorage.setItem("tiresias_cookies_accepted", "true");
        const banner = document.getElementById("cookieBanner");
        if(banner) banner.classList.remove("show");
      };

      if (!localStorage.getItem("tiresias_cookies_accepted")) {
        setTimeout(() => {
          const banner = document.getElementById("cookieBanner");
          if(banner) banner.classList.add("show");
        }, 1500);
      }
      
      // We do not export switchLanguage with a reload anymore to prevent page reload loop.
`;

html = html.replace('// We do not export switchLanguage with a reload anymore to prevent page reload loop.', jsAccept);

fs.writeFileSync('index.html', html);
console.log('Cookie banner added.');

const fs = require("fs");

let html = fs.readFileSync("index.html", "utf-8");

const cssToInject = `
      .pt-affiliate-modal .pt-affiliate-content {
        position: relative;
        max-width: 95vw;
        max-height: 95vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .pt-affiliate-modal .pt-affiliate-content picture {
        display: block;
      }
      .pt-affiliate-modal .pt-affiliate-content img {
        max-width: 100%;
        max-height: 95vh;
        object-fit: contain;
        border-radius: 12px;
      }
      .pt-affiliate-modal .pt-affiliate-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 15%;
        height: 15%;
        cursor: pointer;
        z-index: 10;
      }
      .pt-affiliate-modal .pt-affiliate-link {
        position: absolute;
        top: 15%;
        left: 0;
        width: 100%;
        height: 85%;
        z-index: 5;
        cursor: pointer;
        display: block;
      }
`;

html = html.replace("</style>", cssToInject + "\n    </style>");

const htmlToInject = `
    <!-- Affiliate Ad Modal (Portuguese) -->
    <div id="ptAffiliateModal" class="glass-modal pt-affiliate-modal">
      <div class="pt-affiliate-content">
        <picture>
          <source media="(max-width: 767px)" id="ptAffiliateSrcMobile" srcset="" />
          <source media="(max-width: 1024px)" id="ptAffiliateSrcTablet" srcset="" />
          <img id="ptAffiliateSrcDesktop" src="" alt="Anúncio Parceiro" />
        </picture>
        <div id="ptAffiliateClose" class="pt-affiliate-close" onclick="closePtAffiliateModal()"></div>
        <a id="ptAffiliateLink" class="pt-affiliate-link" href="https://chk.eduzz.com/G96177JAW1?a=85153592" target="_blank" rel="noopener noreferrer sponsored" onclick="closePtAffiliateModal()"></a>
      </div>
    </div>
`;

html = html.replace('<div id="modalAbout"', htmlToInject + '\n    <div id="modalAbout"');

// Inject logic inside closeWisdom function
const closeWisdomLogic = `        // Início da Lógica do Anúncio Afiliado em Português
        if (typeof currentLanguage !== 'undefined' && currentLanguage.startsWith("pt")) {
          const ptAdModal = document.getElementById("ptAffiliateModal");
          const srcMobile = document.getElementById("ptAffiliateSrcMobile");
          const srcTablet = document.getElementById("ptAffiliateSrcTablet");
          const srcDesktop = document.getElementById("ptAffiliateSrcDesktop");
          
          let shouldShowAd = false;
          let part = 0;
          
          if (ritualCountForSession === 1 && !sessionStorage.getItem("tiresias_pt_affiliate_part1_shown")) {
            shouldShowAd = true;
            part = 1;
            sessionStorage.setItem("tiresias_pt_affiliate_part1_shown", "true");
          } else if (ritualCountForSession === 3 && !sessionStorage.getItem("tiresias_pt_affiliate_part2_shown")) {
            shouldShowAd = true;
            part = 2;
            sessionStorage.setItem("tiresias_pt_affiliate_part2_shown", "true");
          }
          
          if (shouldShowAd) {
            if (part === 1) {
              srcMobile.srcset = "/anuncios-portugues/Parte%2001/ads-cansada-parte1-mobile.webp";
              srcTablet.srcset = "/anuncios-portugues/Parte%2001/ads-cansada-parte1-tablet.webp";
              srcDesktop.src = "/anuncios-portugues/Parte%2001/ads-cansada-parte1-desktop.webp";
            } else {
              srcMobile.srcset = "/anuncios-portugues/Parte%2002/ads-cansada-parte2-mobile.webp";
              srcTablet.srcset = "/anuncios-portugues/Parte%2002/ads-cansada-parte2-tablet.webp";
              srcDesktop.src = "/anuncios-portugues/Parte%2002/ads-cansada-parte2-desktop.webp";
            }
            ptAdModal.classList.add("active");
          }
        }
        // Fim da Lógica do Anúncio Afiliado em Português`;

html = html.replace('setTimeout(() => AudioManager.playAmbientInteracted(), 1000);', closeWisdomLogic + '\n        setTimeout(() => AudioManager.playAmbientInteracted(), 1000);');

const jsGlobalFunctions = `
      window.closePtAffiliateModal = function() {
        document.getElementById("ptAffiliateModal").classList.remove("active");
      };
`;

html = html.replace('window.openModal = function (id) {', jsGlobalFunctions + '\n      window.openModal = function (id) {');

fs.writeFileSync("index.html", html);
console.log("Done");

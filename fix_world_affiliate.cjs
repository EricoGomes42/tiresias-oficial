const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const worldCSS = `
    /* Affiliate Ad Modal (World) */
    .world-affiliate-modal {
      display: none;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 9999;
    }
    .world-affiliate-modal.active {
      display: flex;
    }
    .world-affiliate-modal .world-affiliate-content {
      position: relative;
      max-width: 95vw;
      max-height: 95vh;
      display: inline-block;
      margin: auto;
    }
    .world-affiliate-modal .world-affiliate-content picture {
      display: block;
    }
    .world-affiliate-modal .world-affiliate-content img {
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      display: block;
      border-radius: 12px;
    }
    
    .world-affiliate-hotspot {
      position: absolute;
      cursor: pointer;
      /* background: rgba(0,255,0,0.15); outline: 2px solid green; */
    }
    
    .world-affiliate-hotspot-cta {
      z-index: 2;
    }
    .world-affiliate-hotspot-secondary {
      z-index: 3;
    }
    .world-affiliate-hotspot-close {
      z-index: 4;
    }

    /* WORLD CSS POSITIONS TO BE FILLED LATER */
`;

if (!html.includes('world-affiliate-modal')) {
  // Insert CSS
  html = html.replace('</style>', worldCSS + '\n  </style>');
}

const worldHTML = `
    <!-- Affiliate Ad Modal (World) -->
    <div id="worldAffiliateModal" class="glass-modal world-affiliate-modal">
      <div class="world-affiliate-content">
        <picture>
          <source media="(max-width: 767px)" id="worldAffiliateSrcMobile" srcset="" />
          <source media="(max-width: 1024px)" id="worldAffiliateSrcTablet" srcset="" />
          <img id="worldAffiliateSrcDesktop" src="" alt="Tara Lunar soulmate reading" />
        </picture>
        <a id="worldAffiliateHotspotCta" class="world-affiliate-hotspot world-affiliate-hotspot-cta" href="https://8d6152x6klnkn01rtqqnv4pbfi.hop.clickbank.net" target="_blank" rel="noopener noreferrer sponsored" data-google-vignette="false" onclick="window.handleWorldAffiliateCta(event)"></a>
        <div id="worldAffiliateHotspotSecondary" class="world-affiliate-hotspot world-affiliate-hotspot-secondary" onclick="window.handleWorldAffiliateSecondary(event)"></div>
        <div id="worldAffiliateHotspotClose" class="world-affiliate-hotspot world-affiliate-hotspot-close" onclick="window.handleWorldAffiliateClose(event)"></div>
      </div>
    </div>
`;

if (!html.includes('id="worldAffiliateModal"')) {
  // Insert HTML before ptAffiliateModal
  html = html.replace('<!-- Affiliate Ad Modal (Portuguese) -->', worldHTML + '\n    <!-- Affiliate Ad Modal (Portuguese) -->');
}

const worldJS = `
      window.handleWorldAffiliateCta = function(e) {
        e.stopPropagation();
      };
      
      window.handleWorldAffiliateSecondary = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.closeWorldAffiliateModal();
      };
      
      window.handleWorldAffiliateClose = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.closeWorldAffiliateModal();
      };

      window.closeWorldAffiliateModal = function() {
        const worldAdModal = document.getElementById("worldAffiliateModal");
        if (worldAdModal) {
          worldAdModal.className = "glass-modal world-affiliate-modal";
        }
      };

      window.tentarAbrirAnuncioInternacional = function(parte) {
        console.log("[AFFILIATE WORLD] idioma:", currentLang);
        console.log("[AFFILIATE WORLD] ritual concluído:", ritualCountForSession);
        console.log("[AFFILIATE WORLD] tentando abrir parte:", parte);

        const worldAdModal = document.getElementById("worldAffiliateModal");
        console.log("[AFFILIATE WORLD] modal encontrado:", Boolean(worldAdModal));
        if (!worldAdModal) return;

        const srcMobile = document.getElementById("worldAffiliateSrcMobile");
        const srcTablet = document.getElementById("worldAffiliateSrcTablet");
        const srcDesktop = document.getElementById("worldAffiliateSrcDesktop");

        const chave = parte === 1 ? "tiresias_world_affiliate_part1_shown" : "tiresias_world_affiliate_part2_shown";
        console.log("[AFFILIATE WORLD] flag atual:", sessionStorage.getItem(chave));

        if (sessionStorage.getItem(chave)) return;

        const basePath = parte === 1 ? "/anuncios-ingles-mundo/Parte%2001" : "/anuncios-ingles-mundo/Parte%2002";
        const filenamePrefix = parte === 1 ? "ads-tara-luna-part1" : "ads-tara-luna-part2";

        srcMobile.srcset = \`\${basePath}/\${filenamePrefix}-mobile.webp\`;
        srcTablet.srcset = \`\${basePath}/\${filenamePrefix}-tablet.webp\`;
        srcDesktop.src = \`\${basePath}/\${filenamePrefix}-desktop.webp\`;

        // Check image load
        srcDesktop.onload = () => {
          console.log("[AFFILIATE WORLD] imagem carregada, exibindo modal parte", parte);
          worldAdModal.className = "glass-modal world-affiliate-modal active part-" + parte;
          sessionStorage.setItem(chave, "true");
        };

        srcDesktop.onerror = (e) => {
          console.error("[AFFILIATE WORLD] erro ao carregar imagem", e);
        };
      };
`;

if (!html.includes('handleWorldAffiliateCta')) {
  // Insert JS near ptAffiliate functions
  html = html.replace('window.handleAffiliateCta = function(e) {', worldJS + '\n      window.handleAffiliateCta = function(e) {');
}

// And update the trigger logic inside generateWisdom
const newTriggerLogic = `
          if (ritualCountForSession === 1) {
            if (String(currentLang || "").toLowerCase().startsWith("pt")) {
              window.tentarAbrirAnuncioPortugues(1);
            } else {
              window.tentarAbrirAnuncioInternacional(1);
            }
          }
          if (ritualCountForSession === 3) {
            if (String(currentLang || "").toLowerCase().startsWith("pt")) {
              window.tentarAbrirAnuncioPortugues(2);
            } else {
              window.tentarAbrirAnuncioInternacional(2);
            }
          }
`;

html = html.replace(`          if (ritualCountForSession === 1) {
            window.tentarAbrirAnuncioPortugues(1);
          }
          if (ritualCountForSession === 3) {
            window.tentarAbrirAnuncioPortugues(2);
          }`, newTriggerLogic);


fs.writeFileSync("index.html", html);
console.log("Injected World Affiliate logic skeleton.");

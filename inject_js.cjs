const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const worldJS = `
      // window.testWorldAffiliate = function (part) {
      //   sessionStorage.removeItem("tiresias_world_affiliate_part1_shown");
      //   sessionStorage.removeItem("tiresias_world_affiliate_part2_shown");
      //   window.tentarAbrirAnuncioInternacional(part);
      // };

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

if (!html.includes('window.handleWorldAffiliateCta = function')) {
  html = html.replace('window.handleAffiliateCta = function(e) {', worldJS + '\n      window.handleAffiliateCta = function(e) {');
  fs.writeFileSync("index.html", html);
  console.log("Injected JS");
}

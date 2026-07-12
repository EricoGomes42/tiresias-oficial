const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldLogic = `        // Início da Lógica do Anúncio Afiliado em Português
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

html = html.replace(oldLogic, "");

const newLogic = `        // Lógica do Anúncio Afiliado
        if (typeof currentLang !== 'undefined' && currentLang.startsWith("pt")) {
          if (ritualCountForSession === 1) {
            window.tentarAbrirAnuncioPortugues(1);
          }
          if (ritualCountForSession === 3) {
            window.tentarAbrirAnuncioPortugues(2);
          }
        }`;

html = html.replace('setTimeout(() => AudioManager.playAmbientInteracted(), 1000);', newLogic + '\n        setTimeout(() => AudioManager.playAmbientInteracted(), 1000);');

const triggerFunction = `
      window.tentarAbrirAnuncioPortugues = function(parte) {
        console.log("[AFFILIATE] idioma:", currentLang);
        console.log("[AFFILIATE] ritual concluído:", ritualCountForSession);
        console.log("[AFFILIATE] tentando abrir parte:", parte);

        const ptAdModal = document.getElementById("ptAffiliateModal");
        console.log("[AFFILIATE] modal encontrado:", Boolean(ptAdModal));
        if (!ptAdModal) return;

        const srcMobile = document.getElementById("ptAffiliateSrcMobile");
        const srcTablet = document.getElementById("ptAffiliateSrcTablet");
        const srcDesktop = document.getElementById("ptAffiliateSrcDesktop");

        const chave = parte === 1 ? "tiresias_pt_affiliate_part1_shown" : "tiresias_pt_affiliate_part2_shown";
        console.log("[AFFILIATE] flag atual:", sessionStorage.getItem(chave));

        if (sessionStorage.getItem(chave)) return;

        const basePath = parte === 1 ? "/anuncios-portugues/Parte%2001" : "/anuncios-portugues/Parte%2002";
        const filenamePrefix = parte === 1 ? "ads-cansada-parte1" : "ads-cansada-parte2";

        const desktopUrl = basePath + "/" + filenamePrefix + "-desktop.webp";
        const tabletUrl = basePath + "/" + filenamePrefix + "-tablet.webp";
        const mobileUrl = basePath + "/" + filenamePrefix + "-mobile.webp";

        console.log("[AFFILIATE] imagem:", desktopUrl);

        // Preload image
        const img = new Image();
        img.onload = function() {
          srcMobile.srcset = mobileUrl;
          srcTablet.srcset = tabletUrl;
          srcDesktop.src = desktopUrl;
          
          ptAdModal.classList.add("active");
          
          // Confirma abertura
          setTimeout(() => {
            const isVisible = ptAdModal.classList.contains("active") || getComputedStyle(ptAdModal).opacity !== "0";
            console.log("[AFFILIATE] modal visível:", isVisible);
            if (isVisible) {
              sessionStorage.setItem(chave, "true");
            }
          }, 100);
        };
        img.onerror = function() {
          console.error("[AFFILIATE] falha ao carregar imagem:", desktopUrl);
        };
        img.src = desktopUrl;
      };

      window.testarAnuncioAfiliadoPT = function(parte) {
        window.tentarAbrirAnuncioPortugues(parte);
      };
`;

html = html.replace('window.closePtAffiliateModal = function() {', triggerFunction + '\n      window.closePtAffiliateModal = function() {');

fs.writeFileSync("index.html", html);
console.log("Done");

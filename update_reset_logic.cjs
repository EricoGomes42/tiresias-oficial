const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldResetRitual = `      window.resetRitual = function () {
        sessionStorage.removeItem("tiresiasCycles");
        sessionStorage.removeItem("tiresias_pt_affiliate_part1_shown");
        sessionStorage.removeItem("tiresias_pt_affiliate_part2_shown");
        ritualCountForSession = 0;
        flowState = 0;`;

const newResetRitual = `      window.resetAffiliateCampaignCycle = function() {
        sessionStorage.removeItem("tiresias_pt_affiliate_part1_shown");
        sessionStorage.removeItem("tiresias_pt_affiliate_part2_shown");
        sessionStorage.removeItem("tiresias_world_affiliate_part1_shown");
        sessionStorage.removeItem("tiresias_world_affiliate_part2_shown");
        if (window.closeWorldAffiliateModal) window.closeWorldAffiliateModal();
        if (window.closePtAffiliateModal) window.closePtAffiliateModal();
      };

      window.resetRitual = function () {
        sessionStorage.removeItem("tiresiasCycles");
        window.resetAffiliateCampaignCycle();
        ritualCountForSession = 0;
        flowState = 0;`;

html = html.replace(oldResetRitual, newResetRitual);

const oldUnlockWithTaps = `        } else if (tapCount >= 7) {
          // Código secreto: 7 toques exibe o pop-up AdBlock
          triggerAdblock();
          DOM.btn.style.boxShadow = "0 0 20px red";
          setTimeout(() => (DOM.btn.style.boxShadow = ""), 500);
          tapCount = 0; // reseta
        }`;

const newUnlockWithTaps = `        } else if (tapCount >= 7) {
          // Código secreto: 7 toques exibe o pop-up AdBlock e reseta campanhas
          triggerAdblock();
          window.resetAffiliateCampaignCycle();
          DOM.btn.style.boxShadow = "0 0 20px red";
          setTimeout(() => (DOM.btn.style.boxShadow = ""), 500);
          tapCount = 0; // reseta
        }`;

html = html.replace(oldUnlockWithTaps, newUnlockWithTaps);

fs.writeFileSync("index.html", html);
console.log("Updated reset logic.");

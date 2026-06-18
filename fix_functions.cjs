const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const missingCode = `
      let currentLang = "en";
      let t = i18n["en"];

      function getUserLanguage() {
        const savedLang = localStorage.getItem("tiresias_lang");
        if (savedLang && i18n[savedLang]) return savedLang;
        return "en";
      }

      function getLangShort(code) {
         if(!code) return "EN";
         const m = {
           "en":"EN", "pt":"PT", "es":"ES", "fr":"FR", "de":"DE", "it":"IT", "ja":"JA", "ko":"KO",
           "zh":"ZH", "hi":"HI", "ar":"AR", "ru":"RU", "tr":"TR", "nl":"NL", "pl":"PL", "uk":"UK", "id":"ID"
         };
         return m[code] || code.toUpperCase();
      }

      window.switchLanguage = function(newLang) {
        if (!i18n[newLang]) return;
        localStorage.setItem("tiresias_lang", newLang);
        applyTranslations(newLang);

        const d1 = document.getElementById("desktopLangDropdown");
        if(d1) d1.classList.remove("active");
        const d2 = document.getElementById("mobLangDropdown");
        if(d2) d2.classList.remove("active");
      };

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
`;

if (!html.includes("function getUserLanguage()")) {
  html = html.replace("      window.toggleLangMenu = function", missingCode + "\n      window.toggleLangMenu = function");
  fs.writeFileSync('index.html', html);
  console.log("Fixed missing functions");
} else {
  console.log("Functions already exist");
}

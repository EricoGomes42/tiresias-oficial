const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldStr = `                // Lógica do Anúncio Afiliado
        if (typeof currentLang !== 'undefined' && currentLang.startsWith("pt")) {

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

        }`;

const newStr = `                // Lógica do Anúncio Afiliado
        const isPortuguese = String(currentLang || "").toLowerCase().startsWith("pt");
        if (ritualCountForSession === 1) {
          if (isPortuguese) {
            window.tentarAbrirAnuncioPortugues(1);
          } else {
            window.tentarAbrirAnuncioInternacional(1);
          }
        }
        if (ritualCountForSession === 3) {
          if (isPortuguese) {
            window.tentarAbrirAnuncioPortugues(2);
          } else {
            window.tentarAbrirAnuncioInternacional(2);
          }
        }`;

html = html.replace(oldStr, newStr);
fs.writeFileSync("index.html", html);
console.log("Fixed wrapper.");

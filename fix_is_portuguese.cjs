const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

html = html.replace('const isPortuguese = String(currentLang || "").toLowerCase().startsWith("pt");', 'const isPortuguese = String(currentLang || document.documentElement.lang || "en").toLowerCase().startsWith("pt");');

fs.writeFileSync("index.html", html);
console.log("Fixed isPortuguese");

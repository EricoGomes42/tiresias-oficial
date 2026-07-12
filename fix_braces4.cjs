const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

html = html.replace(
  "        if (DOM.inst)\\n          DOM.inst.innerHTML = window.formatLimitMessage(t.limitMsg || \\\"O ciclo foi concluído.\\\"); DOM.inst.classList.add(\\\"limit-mode\\\");",
  '        if (DOM.inst) { DOM.inst.innerHTML = window.formatLimitMessage(t.limitMsg || "O ciclo foi concluído."); DOM.inst.classList.add("limit-mode"); }'
);

fs.writeFileSync("index.html", html);
console.log("Fixed 5075-5076");

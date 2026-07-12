const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

html = html.replace(
  /if \\(DOM\\.inst\\)\\s+DOM\\.inst\\.innerHTML = window\\.formatLimitMessage\\(t\\.limitMsg \\|\\| "O ciclo foi concluído\\."\\); DOM\\.inst\\.classList\\.add\\("limit-mode"\\);/g,
  'if (DOM.inst) { DOM.inst.innerHTML = window.formatLimitMessage(t.limitMsg || "O ciclo foi concluído."); DOM.inst.classList.add("limit-mode"); }'
);

html = html.replace(
  /DOM\\.inst\\.innerHTML = window\\.formatLimitMessage\\(t\\.limitMsg \\|\\| t\\.doneMsg\\); DOM\\.inst\\.classList\\.add\\("limit-mode"\\);/g,
  'if (DOM.inst) { DOM.inst.innerHTML = window.formatLimitMessage(t.limitMsg || t.doneMsg); DOM.inst.classList.add("limit-mode"); }'
);

fs.writeFileSync("index.html", html);
console.log("Fixed braces 2");

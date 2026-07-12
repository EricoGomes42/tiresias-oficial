const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

html = html.replace(
  /if \(DOM\.inst\) DOM\.inst\.innerHTML = window\.formatLimitMessage\((.*?)\); DOM\.inst\.classList\.add\("limit-mode"\);/g,
  'if (DOM.inst) { DOM.inst.innerHTML = window.formatLimitMessage($1); DOM.inst.classList.add("limit-mode"); }'
);

html = html.replace(
  /if \(DOM\.inst\)\\s+DOM\.inst\.innerHTML = window\.formatLimitMessage\((.*?)\); DOM\.inst\.classList\.add\("limit-mode"\);/g,
  'if (DOM.inst) { DOM.inst.innerHTML = window.formatLimitMessage($1); DOM.inst.classList.add("limit-mode"); }'
);

html = html.replace(
  /if \(DOM\.inst\) DOM\.inst\.innerHTML = t\.instruction; DOM\.inst\.classList\.remove\("limit-mode"\);/g,
  'if (DOM.inst) { DOM.inst.innerHTML = t.instruction; DOM.inst.classList.remove("limit-mode"); }'
);

fs.writeFileSync("index.html", html);
console.log("Fixed braces");

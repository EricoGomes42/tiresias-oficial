const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");
let lines = html.split("\\n");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('DOM.inst.innerHTML = window.formatLimitMessage')) {
    if (!lines[i].includes('if (DOM.inst) {')) {
      if (lines[i-1].includes('if (DOM.inst)')) {
        lines[i-1] = ''; // clear the line above
        lines[i] = '        if (DOM.inst) { ' + lines[i].trim() + ' }';
      } else {
        lines[i] = '          if (DOM.inst) { ' + lines[i].trim() + ' }';
      }
    }
  }
}
fs.writeFileSync("index.html", lines.join("\\n"));
console.log("Fixed lines manually.");

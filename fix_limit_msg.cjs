const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldLimitMsgLogics = [
  'DOM.inst.innerHTML = t.limitMsg || t.doneMsg;',
  'DOM.inst.innerHTML = t.limitMsg || "O ciclo foi concluído.";'
];

html = html.replace(/DOM\.inst\.innerHTML = t\.limitMsg \|\| t\.doneMsg;/g, 'DOM.inst.innerHTML = window.formatLimitMessage(t.limitMsg || t.doneMsg); DOM.inst.classList.add("limit-mode");');
html = html.replace(/DOM\.inst\.innerHTML = t\.limitMsg \|\| "O ciclo foi concluído\.";/g, 'DOM.inst.innerHTML = window.formatLimitMessage(t.limitMsg || "O ciclo foi concluído."); DOM.inst.classList.add("limit-mode");');
html = html.replace(/DOM\.inst\.innerHTML = t\.instruction;/g, 'DOM.inst.innerHTML = t.instruction; DOM.inst.classList.remove("limit-mode");');

const formatFn = `
      window.formatLimitMessage = function(msg) {
        if (!msg) return "";
        let formatted = msg.replace(/\\.\\s+/g, '.<br><br>');
        return formatted;
      };
      
      window.closeModal = function`;

html = html.replace("window.closeModal = function", formatFn);

fs.writeFileSync("index.html", html);
console.log("Updated limit message logic");

const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// The logic inside `DOM.btn.addEventListener("click", () => { ... }` 
// needs to remove the rigid "concluded" lock, and instead use cycles.
content = content.replace(
  /\s*\/\/\s*Set lock\s*sessionStorage\.setItem\("tiresiasTrance", "concluded"\);/g,
  `` // Just remove this hardcoded block
);

// We should also remove the Trava de Sessao no início do init:
content = content.replace(
  /\s*\/\/\s*Trava de Sessão Rigorosa[^\n]*\n\s*if\s*\(sessionStorage\.getItem\("tiresiasTrance"\)\s*===\s*"concluded"\)\s*\{[\s\S]*?\}/g,
  ``
);

// Let's replace the `closeWisdom` block entirely
content = content.replace(
  /window\.closeWisdom = function \(\) \{[\s\S]*?\/\/ Re-toca o ambiente após fechar a mensagem/g,
  `window.closeWisdom = function () {
        DOM.box.classList.remove("revealed");
        DOM.body.classList.remove("state-revealed");
        DOM.body.classList.remove("sintonizando");
        DOM.bg.classList.remove("sintonizando");
        DOM.glow.classList.remove("sintonizando");

        ritualCountForSession++;
        sessionStorage.setItem("tiresiasCycles", ritualCountForSession.toString());

        if (ritualCountForSession >= 3) {
          flowState = 3;
          DOM.btn.disabled = true;
          DOM.btn.classList.remove("action-ready");
          DOM.btn.style.display = "inline-block";
          DOM.inst.innerHTML = t.limitMsg || t.doneMsg;
          DOM.btn.style.display = "none";
        } else {
          flowState = 0;
          DOM.btn.disabled = false;
          DOM.btn.classList.remove("action-ready");
          DOM.btn.innerText = getBtnStartText();
          DOM.btn.style.display = "inline-block";
          DOM.inst.innerHTML = t.instruction;
        }

        // Re-toca o ambiente após fechar a mensagem`
);

// Delete resetRitual logic if any, and just make it a pure reset
content = content.replace(
  /window\.resetRitual = function \(\) \{[\s\S]*?DOM\.inst\.innerHTML = t\.instruction;\n\s*\};/g,
  `window.resetRitual = function () {
        sessionStorage.removeItem("tiresiasCycles");
        ritualCountForSession = 0;
        flowState = 0;
        DOM.box.classList.remove("revealed");
        DOM.body.classList.remove("state-revealed");
        DOM.body.classList.remove("sintonizando");
        DOM.bg.classList.remove("sintonizando");
        DOM.glow.classList.remove("sintonizando");

        DOM.btn.disabled = false;
        DOM.btn.classList.remove("action-ready");
        DOM.btn.innerText = getBtnStartText();
        DOM.btn.style.display = "inline-block";
        DOM.inst.innerHTML = t.instruction;
      };`
);

// We need to establish flow state properly when loading if cycles >= 3
content = content.replace(
  /function getBtnStartText\(\)/,
  `if (ritualCountForSession >= 3) {
        flowState = 3;
        if(DOM.btn) DOM.btn.style.display = "none";
        if(DOM.inst) DOM.inst.innerHTML = t.limitMsg || "O ciclo foi concluído.";
      }
      
      function getBtnStartText()`
);

fs.writeFileSync('index.html', content, 'utf8');
console.log("Updated close wisdom logic");

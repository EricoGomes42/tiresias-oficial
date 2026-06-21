const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const regex = /\/\/ Combine frases com baixo processamento O\(1\)[\s\S]*?DOM\.txt\.innerText = `\$\{f1\}\$\{f2\}\$\{f3\}`;[\s\S]*?\/\/ Aplica classes de transição \(Delegando pro GPU via requestAnimationFrame\)[\s\S]*?DOM\.box\.classList\.add\("revealed"\);\n\s*\}\);/g;

const replacement = `// Get message from Gemini API
          DOM.btn.innerText = t.btnReveal + "...";
          DOM.btn.disabled = true;

          fetch("/api/oracle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: currentLang })
          })
          .then(res => res.json())
          .then(data => {
            if (data.message) {
              DOM.txt.innerText = data.message;
            } else {
              DOM.txt.innerText = "...";
            }
            requestAnimationFrame(() => {
              DOM.body.classList.add("state-revealed");
              DOM.box.classList.add("revealed");
            });
          })
          .catch(err => {
            DOM.txt.innerText = "...";
            requestAnimationFrame(() => {
              DOM.body.classList.add("state-revealed");
              DOM.box.classList.add("revealed");
            });
          });`;

html = html.replace(regex, replacement);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Replaced flowState 2 logic');

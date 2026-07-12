const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const fn = `      window.formatLimitMessage = function(msg) {
        if (!msg) return "";
        let sentences = msg.split('. ').filter(s => s.trim().length > 0);
        return sentences.map(s => \`<span class="limit-sentence">\${s}\${s.endsWith('.') ? '' : '.'}</span>\`).join('');
      };`;

// Remove the old definition
html = html.replace(fn, "");

// Insert it at the start of the script tag
const insertPoint = `    <!-- Motor Cinemático & Lógica Otimizada (INP < 50ms) -->
    <script>`;

html = html.replace(insertPoint, insertPoint + "\\n" + fn);

fs.writeFileSync("index.html", html);
console.log("Hoisted formatLimitMessage");

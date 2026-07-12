const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 1. Add formatWisdomMessage
const formatWisdomFunc = `      window.formatWisdomMessage = function(msg) {
        if (!msg) return "";
        let sentences = msg.split(/(?<=[.?!])\\s+/).filter(s => s.trim().length > 0);
        return sentences.map(s => \`<span class="wisdom-sentence">\${s}</span>\`).join('');
      };

      window.formatLimitMessage = function(msg) {`;

html = html.replace("      window.formatLimitMessage = function(msg) {", formatWisdomFunc);

// 2. Replace DOM.txt.innerText = message with DOM.txt.innerHTML = window.formatWisdomMessage(message)
// Wait, let's see how it's exactly written in JS

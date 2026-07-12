const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const newFormatWisdomFunc = `      window.formatWisdomMessage = function(msg) {
        if (!msg) return "";
        let sentences = msg.match(/[^.!?。！？]+[.!?。！？]*/g);
        if (!sentences || sentences.length === 0) {
            sentences = [msg];
        }
        return sentences.map(s => \`<span class="wisdom-sentence">\${s.trim()}</span>\`).join('');
      };

      window.formatLimitMessage = function(msg) {`;

const oldFormatWisdomFunc = /      window\.formatWisdomMessage = function\(msg\) \{[\s\S]*?window\.formatLimitMessage = function\(msg\) \{/;

html = html.replace(oldFormatWisdomFunc, newFormatWisdomFunc);
fs.writeFileSync('index.html', html);
console.log("Updated regex match logic");

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const formatWisdom = `      window.formatWisdomMessage = function(msg) {
        if (!msg) return "";
        let sentences = msg.match(/[^.!?。！？]+[.!?。！？]*/g);
        if (!sentences || sentences.length === 0) {
            sentences = [msg];
        }
        return sentences.map(s => \`<span class="wisdom-sentence">\${s.trim()}</span>\`).join('');
      };

`;

html = html.replace('      window.formatLimitMessage = function(msg) {', formatWisdom + '      window.formatLimitMessage = function(msg) {');

fs.writeFileSync('index.html', html);
console.log("Added formatWisdomMessage");

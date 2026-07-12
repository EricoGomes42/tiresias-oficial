const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const newFormatWisdomFunc = `      window.formatWisdomMessage = function(msg) {
        if (!msg) return "";
        
        // Split by standard punctuation followed by space, or full-width Asian punctuation
        // Note: we want to keep the punctuation with the sentence, but String.prototype.split with regex captures can be tricky.
        // Let's use a regex that matches the end of a sentence.
        let sentences = msg.match(/[^.!?。！？]+[.!?。！？]+/g);
        
        if (!sentences || sentences.length === 0) {
            // fallback if no punctuation is matched
            sentences = [msg];
        }
        
        return sentences.map(s => \`<span class="wisdom-sentence">\${s.trim()}</span>\`).join('');
      };

      window.formatLimitMessage = function(msg) {`;

// We replace the old formatWisdomFunc
const oldFormatWisdomFunc = `      window.formatWisdomMessage = function(msg) {
        if (!msg) return "";
        let sentences = msg.split(/(?<=[.?!])\\s+/).filter(s => s.trim().length > 0);
        return sentences.map(s => \`<span class="wisdom-sentence">\${s}</span>\`).join('');
      };

      window.formatLimitMessage = function(msg) {`;

html = html.replace(oldFormatWisdomFunc, newFormatWisdomFunc);

fs.writeFileSync('index.html', html);
console.log("Fixed asian sentence splitting");

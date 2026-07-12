const formatWisdomMessage = function(msg) {
    if (!msg) return "";
    let sentences = msg.match(/[^.!?。！？]+[.!?。！？]+/g);
    if (!sentences || sentences.length === 0) {
        sentences = [msg];
    }
    return sentences.map(s => `<span class="wisdom-sentence">${s.trim()}</span>`).join('');
};

console.log(formatWisdomMessage("Sentence 1. Sentence 2 without punctuation"));

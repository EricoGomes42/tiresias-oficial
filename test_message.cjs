const formatWisdomMessage = function(msg) {
    if (!msg) return "";
    let sentences = msg.match(/[^.!?。！？]+[.!?。！？]+/g);
    if (!sentences || sentences.length === 0) {
        sentences = [msg];
    }
    return sentences.map(s => `<span class="wisdom-sentence">${s.trim()}</span>`).join('');
};

console.log(formatWisdomMessage("This is a test. Another test! What about this? Yes."));
console.log(formatWisdomMessage("現在の循環は終了しました。真の明確さは静寂の中に生まれます。後ほどお戻りください。"));

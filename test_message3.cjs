const formatWisdomMessage = function(msg) {
    if (!msg) return "";
    let sentences = msg.split(/(?<=[.!?。！？])\s+/);
    // wait, if there is no space after the punctuation, \s+ won't match!
    // what if we use \s*?
    let sentences2 = msg.split(/(?<=[.!?。！？])\s*/).filter(s => s.trim().length > 0);
    return sentences2.map(s => `<span class="wisdom-sentence">${s.trim()}</span>`).join('');
};

console.log(formatWisdomMessage("This is a test. Another test! What about this? Yes."));
console.log(formatWisdomMessage("現在の循環は終了しました。真の明確さは静寂の中に生まれます。後ほどお戻りください。"));
console.log(formatWisdomMessage("Sentence 1. Sentence 2 without punctuation"));
console.log(formatWisdomMessage("A sentence without punctuation"));

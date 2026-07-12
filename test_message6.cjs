const formatWisdomMessage = function(msg) {
    if (!msg) return "";
    let sentences = msg.split(/(?<=[.!?。！？]+)\s*/).filter(s => s.trim().length > 0);
    return sentences.map(s => `<span class="wisdom-sentence">${s.trim()}</span>`).join('');
};

console.log(formatWisdomMessage("Hello... World. What's up?"));
console.log(formatWisdomMessage("現在の循環は終了しました。真の明確さは静寂の中に生まれます。後ほどお戻りください。"));

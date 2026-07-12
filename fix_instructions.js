const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

// We want to replace `<span class="desktop-only-text">TEXT1<br>TEXT2 O oráculo...</span>`
// With `<span class="desktop-only-text"><span class="instruction-line instruction-line-1">TEXT1</span><span class="instruction-line instruction-line-2">TEXT2</span><span class="instruction-line instruction-line-3">O oráculo...</span></span>`

content = content.replace(/<span class="desktop-only-text">([^<]+)<br>([^<]+?)(The oracle|O oráculo|O Oráculo|El oráculo|L'oracle|L'oracolo|Das Orakel|De orakel|Oraklet|Wyrocznia|Оракул|Оракулът|To manteio|Kahini|신탁|神谕|神諭|オラクル|الوحي)([^<]+)<\/span>/g, (match, p1, p2, p3, p4) => {
  // Let's refine the regex or do it programmatically
});

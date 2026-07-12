const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');
content = content.replace(
  /<span class="desktop-only-text"\s*>Respire fundo\.<br \/>Entre em silêncio\.<br \/>Reflita sobre seu momento\.<br \/>O oráculo tem algo a revelar...<\/span>/,
  '<span class="desktop-only-text"><span class="instruction-line instruction-line-1">Respire fundo. Entre em silêncio.</span><span class="instruction-line instruction-line-2">Reflita sobre seu momento.</span><span class="instruction-line instruction-line-3">O oráculo tem algo a revelar...</span></span>'
);

fs.writeFileSync('index.html', content, 'utf-8');
console.log("Updated HTML.");

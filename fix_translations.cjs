const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
  /if\(DOM\.inst\) DOM\.inst\.innerHTML = t\.instruction;/g,
  `if (typeof flowState !== 'undefined' && flowState === 3) {\n            if(DOM.inst) DOM.inst.innerHTML = t.limitMsg || t.doneMsg;\n        } else {\n            if(DOM.inst) DOM.inst.innerHTML = t.instruction;\n        }`
);

fs.writeFileSync('index.html', content, 'utf8');
console.log("Updated applyTranslations logic");

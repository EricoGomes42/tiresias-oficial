const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
/if\(typeof updateLanguage === 'function'\) updateLanguage\(currentLang\);/s,
"if(typeof applyTranslations === 'function') applyTranslations(currentLang);"
);

fs.writeFileSync('index.html', code);
console.log('Done');

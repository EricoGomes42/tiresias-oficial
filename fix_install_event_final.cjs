const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(
/deferredPrompt = e;\s*checkAndShowInstallPrompt\(\);/s,
`deferredPrompt = e;
        checkAndShowInstallPrompt();
        if(typeof updateLanguage === 'function') updateLanguage(currentLang);`
);

fs.writeFileSync('index.html', code);
console.log('Done');

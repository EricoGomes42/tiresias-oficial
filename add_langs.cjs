const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const additionalLangs = `
              <div class="lang-option" onclick="switchLanguage('el')">Ελληνικά</div>
              <div class="lang-option" onclick="switchLanguage('he')">עברית</div>
              <div class="lang-option" onclick="switchLanguage('ro')">Română</div>`;

html = html.replace(
    /<div class="lang-option" onclick="switchLanguage\('id'\)">Bahasa Indonesia<\/div>/g,
    `<div class="lang-option" onclick="switchLanguage('id')">Bahasa Indonesia</div>${additionalLangs}`
);

html = html.replace(
    /"nl":"NL", "pl":"PL", "uk":"UK", "id":"ID"/g,
    `"nl":"NL", "pl":"PL", "uk":"UK", "id":"ID", "el":"EL", "he":"HE", "ro":"RO"`
);

// We need to fetch and inject the translation definitions for el, he, ro into i18n structure.
fs.writeFileSync('index.html', html, 'utf8');
console.log('Language dropdowns updated');

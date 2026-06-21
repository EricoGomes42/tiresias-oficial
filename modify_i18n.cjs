const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const additions = {
  "pt": `"btnStart2": "Reiniciar Ritual",\n    "btnStart3": "Último Ritual",`,
  "en": `"btnStart2": "Restart Ritual",\n    "btnStart3": "Final Ritual",`,
  "es": `"btnStart2": "Reiniciar Ritual",\n    "btnStart3": "Último Ritual",`,
  "fr": `"btnStart2": "Redémarrer le Rituel",\n    "btnStart3": "Dernier Rituel",`,
  "de": `"btnStart2": "Ritual Neustarten",\n    "btnStart3": "Letztes Ritual",`,
  "it": `"btnStart2": "Riavvia Rituale",\n    "btnStart3": "Ultimo Rituale",`,
  "ja": `"btnStart2": "儀式を再開する",\n    "btnStart3": "最後の儀式",`,
  "ko": `"btnStart2": "의식 재시작",\n    "btnStart3": "마지막 의식",`,
  "zh": `"btnStart2": "重新开始仪式",\n    "btnStart3": "最后一次仪式",`,
  "hi": `"btnStart2": "अनुष्ठान फिर से शुरू करें",\n    "btnStart3": "अंतिम अनुष्ठान",`,
  "ru": `"btnStart2": "Перезапустить ритуал",\n    "btnStart3": "Последний ритуал",`,
  "tr": `"btnStart2": "Ritüeli Yeniden Başlat",\n    "btnStart3": "Son Ritüel",`,
  "nl": `"btnStart2": "Herstart Ritueel",\n    "btnStart3": "Laatste Ritueel",`,
  "pl": `"btnStart2": "Zrestartuj Rytuał",\n    "btnStart3": "Ostatni Rytuał",`,
  "uk": `"btnStart2": "Перезапустити ритуал",\n    "btnStart3": "Останній ритуал",`,
  "id": `"btnStart2": "Mulai Ulang Ritual",\n    "btnStart3": "Ritual Terakhir",`,
  "ar": `"btnStart2": "إعادة بدء الطقوس",\n    "btnStart3": "الطقوس الأخيرة",`
};

for (const [lang, text] of Object.entries(additions)) {
  const regex = new RegExp(`("${lang}":\\s*\\{[\\s\\S]*?"btnStart":\\s*".*?",)`);
  content = content.replace(regex, `$1\n    ${text}`);
}

fs.writeFileSync('index.html', content, 'utf8');
console.log("i18n keys injected");

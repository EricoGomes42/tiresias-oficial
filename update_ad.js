const fs = require('fs');
let code = fs.readFileSync('i18n.js', 'utf8');

const translates = {
  pt: { desc: 'Para manter este refúgio aberto e gratuito, considere desativar seu bloqueador de anúncios. Eles ajudam a cobrir os custos do oráculo.', btn: 'Já desativei / Continuar' },
  en: { desc: 'To keep this refuge open and free, please consider disabling your ad blocker. Ads help cover the oracle\\'s costs.', btn: 'I disabled it / Continue' },
  es: { desc: 'Para mantener este refugio abierto y gratuito, considera desactivar tu bloqueador de anuncios. Ayudan a cubrir los costos del oráculo.', btn: 'Ya lo desactivé / Continuar' },
  fr: { desc: 'Pour garder ce refuge ouvert et gratuit, pensez à désactiver votre bloqueur de publicités. Elles aident à couvrir les frais.', btn: 'Déjà désactivé / Continuer' },
  de: { desc: 'Um dieses Refugium offen und kostenlos zu halten, erwägen Sie bitte, Ihren Adblocker zu deaktivieren. Anzeigen helfen, die Kosten zu decken.', btn: 'Ich habe es deaktiviert / Weiter' },
  it: { desc: 'Per mantenere questo rifugio aperto e gratuito, considera di disattivare il tuo adblocker. Gli annunci aiutano a coprire i costi.', btn: 'L\\'ho disattivato / Continua' },
  ja: { desc: 'この避難所を無料で公開し続けるために、広告ブロッカーの無効化をご検討ください。広告は運営費用の助けとなります。', btn: '無効にしました / 続ける' },
  ko: { desc: '이 안식처를 무료로 개방하기 위해 광고 차단기를 비활성화해 주시길 부탁드립니다. 광고는 운영 비용에 도움이 됩니다.', btn: '비활성화했습니다 / 계속하기' },
  zh: { desc: '为了让这个避难所保持免费开放，请考虑停用您的广告拦截器。广告有助于支付甲骨文的运行成本。', btn: '已停用 / 继续' },
  hi: { desc: 'इस आश्रय को खुला और मुफ्त रखने के लिए, कृपया अपना विज्ञापन अवरोधक अक्षम करने पर विचार करें। विज्ञापन लागत को कवर करने में मदद करते हैं।', btn: 'मैंने इसे अक्षम कर दिया / जारी रखें' },
  ru: { desc: 'Чтобы этот приют оставался открытым и бесплатным, пожалуйста, отключите блокировщик рекламы. Это помогает покрыть расходы.', btn: 'Я отключил / Продолжить' },
  tr: { desc: 'Bu sığınağı açık ve ücretsiz tutmak için lütfen reklam engelleyicinizi devre dışı bırakmayı düşünün. Reklamlar masrafları karşılamaya yardımcı olur.', btn: 'Devre dışı bıraktım / Devam Et' },
  nl: { desc: 'Om dit toevluchtsoord open en gratis te houden, overweeg dan je adblocker uit te schakelen. Advertenties helpen de kosten te dekken.', btn: 'Ik heb het uitgeschakeld / Doorgaan' },
  pl: { desc: 'Aby to schronienie pozostało otwarte i bezpłatne, rozważ wyłączenie blokera reklam. Pomagają one pokryć koszty utrzymania.', btn: 'Wyłączyłem / Kontynuuj' },
  uk: { desc: 'Щоб цей притулок залишався відкритим і безкоштовним, будь ласка, вимкніть блокувальник реклами. Це допомагає покривати витрати.', btn: 'Я вимкнув / Продовжити' },
  id: { desc: 'Untuk menjaga tempat berlindung ini tetap terbuka dan gratis, pertimbangkan untuk menonaktifkan pemblokir iklan Anda. Iklan membantu menutupi biaya.', btn: 'Saya menonaktifkannya / Lanjutkan' },
  ar: { desc: 'لإبقاء هذا الملجأ مفتوحًا ومجانيًا، يرجى التفكير في إيقاف مانع الإعلانات. الإعلانات تساعد في تغطية التكاليف.', btn: 'لقد أوقفته / استمر' },
  el: { desc: 'Για να διατηρήσετε αυτό το καταφύγιο ανοιχτό και δωρεάν, σκεφτείτε να απενεργοποιήσετε το adblocker σας. Οι διαφημίσεις βοηθούν στην κάλυψη των εξόδων.', btn: 'Το απενεργοποίησα / Συνέχεια' },
  he: { desc: 'כדי להשאיר מקלט זה פתוח בחינם, אנא שקול להשבית את חוסם הפרסומות שלך. פרסומות עוזרות לכסות את העלויות.', btn: 'השבתתי / המשך' },
  ro: { desc: 'Pentru a menține acest refugiu deschis și gratuit, te rugăm să iei în considerare dezactivarea adblocker-ului. Ajută la acoperirea costurilor.', btn: 'L-am dezactivat / Continuă' }
};

for (const lang in translates) {
  const p = translates[lang];
  code = code.replace(new RegExp(`(\"${lang}\":\\s*\\{.*?)(\"adblockDesc\":\\s*\".*?\")`, 's'), `$1\"adblockDesc\": "${p.desc}"`);
  code = code.replace(new RegExp(`(\"${lang}\":\\s*\\{.*?)(\"adblockBtn\":\\s*\".*?\")`, 's'), `$1\"adblockBtn\": "${p.btn}"`);
}
fs.writeFileSync('i18n.js', code);
console.log('Update complete');

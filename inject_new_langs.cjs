const fs = require('fs');

const el = {
  instruction: '<span class="desktop-text">Πάρτε μια βαθιά ανάσα.<br class="tablet-br"> Μπείτε στη σιωπή.<br class="tablet-br"> Σκεφτείτε τη στιγμή σας.<br>Το μαντείο έχει κάτι να αποκαλύψει...</span><span class="desktop-only-text">Πάρτε μια βαθιά ανάσα. Μπείτε στη σιωπή.<br>Σκεφτείτε τη στιγμή σας. Το μαντείο έχει κάτι να αποκαλύψει...</span><span class="mobile-text">Πάρτε μια βαθιά ανάσα.<br>Μπείτε στη σιωπή.<br>Σκεφτείτε τη στιγμή σας.<br>Το μαντείο έχει κάτι<br>να αποκαλύψει...</span>',
  btnStart: 'Έναρξη Τελετουργικού',
  btnStart2: 'Επανεκκίνηση Τελετουργικού',
  btnStart3: 'Τελευταίο Τελετουργικό',
  btnTuning: 'Συντονισμός... ({count})',
  btnReveal: 'Αποκάλυψη Μηνύματος',
  btnDone: 'Το Τελετουργικό Ολοκληρώθηκε',
  doneMsg: 'Επιστρέψτε σε ένα νέο ταξίδι.<br>Το μυαλό χρειάζεται χρόνο για να αφομοιώσει.',
  btnStop: 'Το Τελετουργικό Διακόπηκε',
  close: 'Κλείσιμο',
  download: 'Λήψη JPG',
  share: 'Μοιραστείτε τη Σοφία',
  about: 'Σχετικά',
  terms: 'Όροι',
  privacy: 'Απόρρητο',
  aboutTitle: 'Σχετικά με τον Tiresias',
  aboutText: '<p>Ο Tiresias (Τειρεσίας) είναι ένας ψηφιακός χώρος για παύση και ενσυνειδητότητα, εστιασμένος στη θετική ψυχολογία. Αποστολή μας είναι να προσφέρουμε μικρές στιγμές στοχασμού και γαλήνης μέσα στη ρουτίνα της υπερσύνδεσης.</p><h3>Ποιος ήταν ο Τειρεσίας;</h3><p>Στην ελληνική μυθολογία, ο Τειρεσίας ήταν ένας τυφλός μάντης που έβλεπε πέρα από τον φυσικό κόσμο. Εδώ, αντιπροσωπεύει την <strong>αυτογνωσία</strong> και το ταξίδι προς τα μέσα.</p><h3>Πώς λειτουργεί;</h3><p>Είναι ένα εργαλείο στοχασμού. Δεν κάνουμε προβλέψεις. Τα μηνύματα προσφέρουν <strong>συναισθηματική ανακούφιση</strong>, ελπίδα και υποστήριξη σε δύσκολες στιγμές.</p><h3>Συχνές Ερωτήσεις (FAQ)</h3><ul><li><strong>Προβλέπει το μέλλον;</strong><br>Όχι. Εστιάζει στο παρόν για την προσωπική σας ανάπτυξη.</li><li><strong>Σχετίζεται με θρησκείες;</strong><br>Όχι, είναι απολύτως ουδέτερο.</li><li><strong>Αντικαθιστά την επαγγελματική βοήθεια;</strong><br>Όχι, σε περίπτωση ανάγκης συμβουλευτείτε ψυχολόγο.</li><li><strong>Βοηθάει στο πένθος ή τον χωρισμό;</strong><br>Ναι, λειτουργεί σαν συναισθηματική αγκαλιά για νέα ξεκινήματα.</li></ul>',
  termsTitle: 'Όροι Χρήσης',
  termsText: '<p>Χρησιμοποιώντας τον Tiresias, συμφωνείτε ότι αυτή η πλατφόρμα έχει <strong>αποκλειστικά ψυχαγωγικό και αναστοχαστικό</strong> χαρακτήρα.</p><ul><li>Η χρήση γίνεται με δική σας ευθύνη.</li><li><strong>Καμία ιατρική συμβουλή:</strong> Δεν αντικαθιστούμε την ψυχολογική θεραπεία.</li><li>Τα κείμενα προορίζονται μόνο για την προώθηση της <strong>συναισθηματικής ευεξίας</strong>.</li></ul>',
  privacyTitle: 'Πολιτική Απορρήτου',
  privacyText: '<p>Σεβόμαστε το απόρρητό σας σύμφωνα με τη νομοθεσία (GDPR, CCPA).</p><ul><li><strong>Ανώνυμα δεδομένα:</strong> Μόνο η προτίμηση γλώσσας αποθηκεύεται τοπικά.</li><li><strong>Cookies & Διαφημίσεις:</strong> Χρησιμοποιούμε Google Analytics και AdSense με μη παρεμβατικό τρόπο.</li></ul>',
  shareText: 'Το Μαντείο Tiresias μου είπε σήμερα: "{msg}". Ανακάλυψε το δικό σου μήνυμα στο tiresias.guru',
  blogTitle: 'Blog του Tiresias',
  blogText: '<p>Το Blog του Tiresias υπό κατασκευή. Σύντομα θα βρείτε άρθρα για την αυτογνωσία, τη γαλήνη και πώς να βρίσκετε ελπίδα.</p>',
  blog: 'Blog',
  cookieText: 'Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας. Συνεχίζοντας, αποδέχεστε την Πολιτική Απορρήτου.',
  cookieBtn: 'Το κατάλαβα',
  adblockTitle: 'Υποστηρίξτε το Μαντείο',
  adblockDesc: 'Παρακαλούμε απενεργοποιήστε το adblocker σας για να διατηρήσουμε αυτό το ψηφιακό καταφύγιο ζωντανό.',
  adblockBtn: 'Το απενεργοποίησα',
  adblockChecking: 'Έλεγχος...',
  adblockStillBlocked: 'Ακόμα μπλοκαρισμένο',
  limitMsg: 'Ο κύκλος έκλεισε προς το παρόν. Η αληθινή διαύγεια γεννιέται στη σιωπή. Επιστρέψτε αργότερα.'
};

const he = {
  instruction: '<span class="desktop-text">קח נשימה עמוקה.<br class="tablet-br"> היכנס אל השקט.<br class="tablet-br"> הרהר ברגע שלך.<br>לאורקל יש מה לחשוף...</span><span class="desktop-only-text">קח נשימה עמוקה. היכנס אל השקט.<br>הרהר ברגע שלך. לאורקל יש מה לחשוף...</span><span class="mobile-text">קח נשימה עמוקה.<br>היכנס אל השקט.<br>הרהר ברגע שלך.<br>לאורקל יש מה<br>לחשוף...</span>',
  btnStart: 'התחל טקס',
  btnStart2: 'הפעל מחדש את הטקס',
  btnStart3: 'טקס אחרון',
  btnTuning: 'מכוון... ({count})',
  btnReveal: 'גלה מסר',
  btnDone: 'הטקס הושלם',
  doneMsg: 'חזור למסע חדש.<br>המוח זקוק לזמן כדי לקלוט.',
  btnStop: 'הטקס הופסק',
  close: 'סגור',
  download: 'הורד כ-JPG',
  share: 'שתף את החוכמה',
  about: 'אודות',
  terms: 'תנאים',
  privacy: 'פרטיות',
  aboutTitle: 'אודות Tiresias',
  aboutText: '<p>Tiresias הוא מרחב דיגיטלי לפסק זמן ותשומת לב, המוקדש לפסיכולוגיה חיובית. המשימה שלנו היא להציע רגעי הרהור ושלווה בתוך השגרה העמוסה.</p><h3>מי היה טירסיאס?</h3><p>במיתולוגיה היוונית, טירסיאס היה נביא עיוור, ידוע בראייתו מעבר לעולם הפיזי. כאן הוא מייצג <strong>מודעות עצמית</strong> והתבוננות פנימה.</p><h3>איך זה עובד?</h3><p>זהו כלי להרהור. איננו חוזים עתידות. המסרים מציעים <strong>ניחום רגשי</strong>, תקווה ותמיכה בזמנים קשים או התחלות חדשות.</p><h3>שאלות נפוצות (FAQ)</h3><ul><li><strong>האם טירסיאס מנבא עתידות?</strong><br>לא. הפרויקט מתמקד בהווה.</li><li><strong>זה דתי?</strong><br>לא, זהו מרחב ניטרלי ללא שיוך דתי.</li><li><strong>האם זה מחליף עזרה מקצועית?</strong><br>בשום אופן לא. פנה לפסיכולוג במידת הצורך.</li><li><strong>עוזר בזמן אֵבֶל או פרידה?</strong><br>כן, מציע מסרים עדינים ותמיכה רגשית.</li></ul>',
  termsTitle: 'תנאי שימוש',
  termsText: '<p>בשימושך ב-Tiresias, אתה מבין שהפלטפורמה היא למטרות <strong>הרהור ורוגע בלבד</strong>.</p><ul><li>השימוש על אחריותך האישית.</li><li><strong>ללא ייעוץ מקצועי:</strong> אין תחליף לטיפול פסיכולוגי.</li><li>המסרים נועדו לעודד <strong>רווחה נפשית</strong> ולא להכתיב החלטות.</li></ul>',
  privacyTitle: 'מדיניות פרטיות',
  privacyText: '<p>אנו מכבדים את פרטיותך (לפי תקנות GDPR, CCPA).</p><ul><li><strong>נתונים אנונימיים:</strong> רק שפת הממשק נשמרת מקומית אצלך.</li><li><strong>עוגיות (Cookies) ופרסומות:</strong> אנו משתמשים ב-Google Analytics וב-AdSense בצורה לא פולשנית.</li></ul>',
  shareText: 'האורקל טירסיאס אמר לי היום: "{msg}". גלה את המסר שלך ב-tiresias.guru',
  blogTitle: 'הבלוג של Tiresias',
  blogText: '<p>חלק הבלוג של Tiresias עדיין בבנייה. בקרוב יהיו בו מאמרים על מודעות עצמית ותקווה.</p>',
  blog: 'בלוג',
  cookieText: 'אנו משתמשים בעוגיות כדי לספק חוויה טובה יותר. בהמשך הגלישה, אתה מסכים למדיניות שלנו.',
  cookieBtn: 'הבנתי',
  adblockTitle: 'תמוך באורקל',
  adblockDesc: 'אנא השבת את חוסם הפרסומות שלך כדי לעזור לנו להשאיר מקלט זה פתוח.',
  adblockBtn: 'השבתתי',
  adblockChecking: 'בודק...',
  adblockStillBlocked: 'עדיין חסום',
  limitMsg: 'המעגל סגור לעת עתה. בהירות אמיתית נולדת בשקט. חזור מאוחר יותר.'
};

const ro = {
  instruction: '<span class="desktop-text">Respiră adânc.<br class="tablet-br"> Intră în tăcere.<br class="tablet-br"> Reflectează la momentul tău.<br>Oracolul are ceva de dezvăluit...</span><span class="desktop-only-text">Respiră adânc. Intră în tăcere.<br>Reflectează la momentul tău. Oracolul are ceva de dezvăluit...</span><span class="mobile-text">Respiră adânc.<br>Intră în tăcere.<br>Reflectează la momentul tău.<br>Oracolul are ceva<br>de dezvăluit...</span>',
  btnStart: 'Începe Ritualul',
  btnStart2: 'Restartează Ritualul',
  btnStart3: 'Ultimul Ritual',
  btnTuning: 'Se conectează... ({count})',
  btnReveal: 'Dezvăluie Mesajul',
  btnDone: 'Ritual Complet',
  doneMsg: 'Revino într-o nouă călătorie.<br>Mintea are nevoie de timp pentru a absorbi.',
  btnStop: 'Ritual Întrerupt',
  close: 'Închide',
  download: 'Descarcă JPG',
  share: 'Distribuie Înțelepciunea',
  about: 'Despre',
  terms: 'Termeni',
  privacy: 'Confidențialitate',
  aboutTitle: 'Despre Tiresias',
  aboutText: '<p>Tiresias este un spațiu digital pentru pauză și mindfulness, axat pe psihologia pozitivă. Misiunea noastră este să oferim micro-momente de reflecție și seninătate.</p><h3>Cine a fost Tiresias?</h3><p>În mitologia greacă, Tiresias a fost un profet orb. Aici, el reprezintă <strong>cunoașterea de sine</strong> și întoarcerea spre interior.</p><h3>Cum funcționează?</h3><p>Este un instrument de contemplare. Nu facem previziuni. Mesajele oferă <strong>confort emoțional</strong>, speranță și sprijin în momentele dificile.</p><h3>Întrebări Frecvente (FAQ)</h3><ul><li><strong>Prezice viitorul?</strong><br>Nu. Proiectul se concentrează pe prezent.</li><li><strong>Este religios?</strong><br>Nu. Este complet neutru.</li><li><strong>Înlocuiește ajutorul profesional?</strong><br>Absolut nu. Căutați un psiholog dacă este nevoie.</li><li><strong>Poate ajuta în caz de durere sau despărțire?</strong><br>Da. Mesajele oferă o îmbrățișare emoțională pentru noi începuturi.</li></ul>',
  termsTitle: 'Termeni de Utilizare',
  termsText: '<p>Utilizând Tiresias, sunteți de acord că această platformă are un caracter <strong>exclusiv recreativ și reflexiv</strong>.</p><ul><li>Utilizarea este pe propria răspundere.</li><li><strong>Fără sfaturi medicale:</strong> Nu înlocuim terapia.</li><li>Mesajele promovează <strong>bunăstarea emoțională</strong>.</li></ul>',
  privacyTitle: 'Politica de Confidențialitate',
  privacyText: '<p>Respectăm confidențialitatea dvs. (conform GDPR, CCPA).</p><ul><li><strong>Date anonime:</strong> Doar limba este salvată local.</li><li><strong>Cookie-uri și Reclame:</strong> Utilizăm Google Analytics și AdSense non-intruziv.</li></ul>',
  shareText: 'Oracolul Tiresias mi-a spus azi: "{msg}". Descoperă mesajul tău pe tiresias.guru',
  blogTitle: 'Blogul Tiresias',
  blogText: '<p>Secțiunea de Blog este în construcție. În curând vor fi adăugate articole despre dezvoltare personală și speranță.</p>',
  blog: 'Blog',
  cookieText: 'Folosim cookie-uri pentru o experiență mai bună. Prin continuarea navigării, acceptați Politica noastră de Confidențialitate.',
  cookieBtn: 'Am înțeles',
  adblockTitle: 'Susține Oracolul',
  adblockDesc: 'Te rugăm să dezactivezi adblocker-ul pentru a menține acest refugiu digital online.',
  adblockBtn: 'L-am dezactivat',
  adblockChecking: 'Se verifică...',
  adblockStillBlocked: 'Încă blocat',
  limitMsg: 'Ciclul este închis deocamdată. Adevărata claritate se naște în liniște. Revino mai târziu.'
};

let html = fs.readFileSync('index.html', 'utf8');

// Insert el, he, ro into i18n object
const extraKeys = `,
  "el": ${JSON.stringify(el, null, 4)},
  "he": ${JSON.stringify(he, null, 4)},
  "ro": ${JSON.stringify(ro, null, 4)}
};`;

html = html.replace(/  "ar": \{[\s\S]*?\}\s*\};/g, (match) => {
    // Drop the closing }; and append the rest
    return match.replace(/\}\s*\};$/, '} ' + extraKeys);
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('Added el, he, ro to i18n');

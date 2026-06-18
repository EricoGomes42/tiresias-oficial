const fs = require('fs');

const languages = {
  pt: {
    aboutTitle: "Sobre Tiresias",
    aboutIntro: "<p>Tiresias é um espaço digital de pausa e atenção plena focado na psicologia positiva. Nossa missão é oferecer micro-momentos de reflexão e serenidade em meio à rotina de hiperconexão.</p>",
    mythology: "<h3>Quem foi Tiresias?</h3><p>Na mitologia grega, Tiresias era um profeta cego, conhecido por sua capacidade de ver além do mundo físico. Em nosso projeto, a figura de Tiresias representa o <strong>autoconhecimento</strong> e a janela para olhar para si mesmo de forma profunda.</p>",
    howItWorks: "<h3>Como o projeto funciona?</h3><p>É uma ferramenta de contemplação. Um momento de pausa em sua vida. Não fazemos previsões. As mensagens buscam oferecer <strong>conforto emocional</strong>, esperança e apoio em momentos difíceis, em transições de vida e em encerramentos de ciclos.</p>",
    faqTitle: "<h3>Perguntas Frequentes (FAQ)</h3>",
    faqs: [
      { q: "O Tiresias prevê o futuro?", a: "Não. O projeto é focado no presente, oferecendo reflexão para desenvolvimento pessoal." },
      { q: "O Tiresias tem vínculo religioso?", a: "Não. É totalmente neutro e não tem vínculos com dogmas ou religiões." },
      { q: "O Tiresias substitui ajuda profissional?", a: "Absolutamente não. Em caso de dificuldades emocionais severas, busque um psicólogo." },
      { q: "Pode ajudar no luto ou após um término?", a: "Sim. As mensagens de apoio podem ser um guia suave e um abraço emocional para recomeços."}
    ],
    termsTitle: "Termos de Uso",
    termsText: "<p>Ao utilizar o Tiresias, você concorda que esta plataforma possui um caráter <strong>exclusivamente recreativo e reflexivo</strong>.</p><ul><li>O uso é de total responsabilidade do usuário.</li><li><strong>Ausência de aconselhamento profissional:</strong> Não substituímos acompanhamento psicológico ou terapia.</li><li>Você concorda com o uso internacional da ferramenta e com a proteção da propriedade intelectual inerente ao nosso acervo.</li></ul><p>As mensagens visam promover <strong>bem-estar emocional</strong> e inspirar, nunca direcionar decisões clínicas ou vitais.</p>",
    privacyTitle: "Política de Privacidade",
    privacyText: "<p>Levamos sua privacidade a sério. Utilizamos práticas estabelecidas pelas leis como LGPD, GDPR e CCPA.</p><ul><li><strong>Dados Anônimos:</strong> Apenas o idioma selecionado e o progresso da sessão podem ser guardados localmente na sua máquina.</li><li><strong>Cookies e Anúncios:</strong> Usamos soluções do Google Analytics para entender nosso alcance anonimamente e o Google AdSense para manter este projeto no ar com anúncios não-intrusivos.</li></ul>",
    blogTitle: "Blog Tiresias",
    blogText: "<p>A seção de Blog do Tiresias está em construção. Em breve, você encontrará artigos profundos sobre desenvolvimento pessoal, autoconhecimento, contemplação e maneiras de encontrar forças e esperança.</p>",
    blog: "Blog"
  },
  en: {
    aboutTitle: "About Tiresias",
    aboutIntro: "<p>Tiresias is a digital space for pause and mindfulness focused on positive psychology. Our mission is to offer micro-moments of reflection and serenity amidst the hyper-connected routine.</p>",
    mythology: "<h3>Who was Tiresias?</h3><p>In Greek mythology, Tiresias was a blind prophet known for seeing beyond the physical world. Here, Tiresias represents <strong>self-knowledge</strong> and the ability to look deeply inward.</p>",
    howItWorks: "<h3>How does it work?</h3><p>Tiresias is a contemplative tool. It is a moment of pause. We do not make predictions. The messages aim to offer <strong>emotional comfort</strong>, hope, and support during difficult moments, life transitions, and the closing of cycles.</p>",
    faqTitle: "<h3>Frequently Asked Questions (FAQ)</h3>",
    faqs: [
      { q: "Does Tiresias predict the future?", a: "No. The project focuses on the present, offering reflection for personal development." },
      { q: "Is Tiresias religious?", a: "No. It is entirely neutral and has no religious affiliations." },
      { q: "Does Tiresias replace professional help?", a: "Absolutely not. In cases of severe emotional distress, please seek a psychologist." },
      { q: "Can it help during grief or after a breakup?", a: "Yes. The messages of support can provide a gentle guide and emotional comfort for new beginnings."}
    ],
    termsTitle: "Terms of Use",
    termsText: "<p>By using Tiresias, you agree that this platform has an <strong>exclusively recreational and reflective</strong> character.</p><ul><li>Use is entirely at the user's risk.</li><li><strong>No Professional Advice:</strong> We do not replace psychological counseling or therapy.</li><li>You agree to the international use of the tool and the intellectual property rights that protect our content.</li></ul><p>The messages promote <strong>emotional well-being</strong> and inspiration, never directing clinical or life decisions.</p>",
    privacyTitle: "Privacy Policy",
    privacyText: "<p>We take your privacy seriously in accordance with laws such as GDPR and CCPA.</p><ul><li><strong>Anonymous Data:</strong> Only your selected language and session progress are stored locally on your device.</li><li><strong>Cookies & Ads:</strong> We use Google Analytics to understand our reach anonymously and Google AdSense to sustain the project with non-intrusive advertising.</li></ul>",
    blogTitle: "Tiresias Blog",
    blogText: "<p>The Tiresias Blog section is currently under construction. Soon, you will find deep articles on personal development, self-knowledge, contemplation, and ways to find strength and hope.</p>",
    blog: "Blog"
  },
  es: {
    aboutTitle: "Acerca de Tiresias",
    aboutIntro: "<p>Tiresias es un espacio digital de pausa y atención plena centrado en la psicología positiva. Nuestra misión es ofrecer micro-momentos de reflexión y serenidad en medio de la rutina hiperconectada.</p>",
    mythology: "<h3>¿Quién fue Tiresias?</h3><p>En la mitología griega, Tiresias fue un profeta ciego conocido por ver más allá del mundo físico. En nuestro proyecto, simboliza el <strong>autoconocimiento</strong> y una mirada profunda hacia el interior.</p>",
    howItWorks: "<h3>¿Cómo funciona?</h3><p>Es una herramienta de contemplación. No hacemos predicciones. Nuestros mensajes buscan brindar <strong>consuelo emocional</strong>, esperanza y apoyo en tiempos difíciles, transiciones de vida y cierre de ciclos.</p>",
    faqTitle: "<h3>Preguntas Frecuentes (FAQ)</h3>",
    faqs: [
      { q: "¿Tiresias predice el futuro?", a: "No. El proyecto se centra en el presente, ofreciendo reflexión para el desarrollo personal." },
      { q: "¿Tiresias es religioso?", a: "No. Es completamente neutral sin vínculos religiosos." },
      { q: "¿Tiresias reemplaza el apoyo psicológico?", a: "Absolutamente no. Si se encuentra en una situación emocional difícil, por favor busque un psicólogo." },
      { q: "¿Puede ayudar durante el duelo o una ruptura?", a: "Sí. Los mensajes de apoyo actúan como una guía y un consuelo emocional para nuevos comienzos."}
    ],
    termsTitle: "Términos de Uso",
    termsText: "<p>Al usar Tiresias, usted comprende que esta plataforma tiene un propósito <strong>exclusivamente de reflexión y bienestar</strong>.</p><ul><li>La responsabilidad de uso recae enteramente en el usuario.</li><li><strong>Sin asesoramiento profesional:</strong> No reemplazamos la terapia ni la orientación médica.</li><li>Usted acepta el uso y nuestra propiedad intelectual compartida como contenido de reflexión.</li></ul><p>Los mensajes buscan fomentar el <strong>bienestar emocional</strong>, nunca prescribir decisiones vitales.</p>",
    privacyTitle: "Política de Privacidad",
    privacyText: "<p>Respetamos su privacidad cumpliendo normativas como GDPR y CCPA.</p><ul><li><strong>Datos Anónimos:</strong> Solo almacenamos el idioma y progreso de forma local en su dispositivo.</li><li><strong>Cookies y Anuncios:</strong> Utilizamos Google Analytics y Google AdSense de forma no intrusiva y anónima.</li></ul>",
    blogTitle: "Blog Tiresias",
    blogText: "<p>El Blog de Tiresias está en construcción. Pronto encontrará artículos sobre desarrollo personal, autoconocimiento, contemplación y cómo encontrar esperanza.</p>",
    blog: "Blog"
  },
  fr: {
    aboutTitle: "À propos de Tiresias",
    aboutIntro: "<p>Tiresias est un espace numérique de pause et de pleine conscience axé sur la psychologie positive. L'objectif est d'offrir des micro-moments de réflexion et de sérénité au milieu de la routine hyperconnectée.</p>",
    mythology: "<h3>Qui était Tiresias ?</h3><p>Dans la mythologie grecque, Tiresias était un devin aveugle, connu pour voir au-delà du monde physique. Dans notre projet, il symbolise la <strong>connaissance de soi</strong> et l'exploration intérieure profonde.</p>",
    howItWorks: "<h3>Comment ça marche ?</h3><p>C'est un outil de contemplation. Nous ne faisons pas de prédictions. Les messages cherchent à offrir un <strong>réconfort émotionnel</strong>, de l'espoir et du soutien lors de transitions de vie et de fins de cycles.</p>",
    faqTitle: "<h3>Foire Aux Questions (FAQ)</h3>",
    faqs: [
      { q: "Tiresias prédit-il l'avenir ?", a: "Non. Le projet est centré sur le présent, offrant des réflexions pour le développement personnel." },
      { q: "Tiresias est-il religieux ?", a: "Non, le site est complètement neutre et sans affiliation religieuse." },
      { q: "Tiresias remplace-t-il l'aide professionnelle ?", a: "Absolument pas. En cas de détresse psychologique importante, consultez un médecin ou un psychologue." },
      { q: "Peut-il aider lors d'un deuil ou d'une rupture ?", a: "Oui, les messages de soutien peuvent agir comme un guide réconfortant pour les nouveaux départs."}
    ],
    termsTitle: "Conditions d'Utilisation",
    termsText: "<p>En utilisant Tiresias, vous acceptez le caractère <strong>exclusivement récréatif et contemplatif</strong> de cette plateforme.</p><ul><li>L'utilisation se fait sous la responsabilité de l'utilisateur.</li><li><strong>Aucun avis médical:</strong> Nous ne remplaçons pas la thérapie ou le suivi psychologique.</li><li>Vous acceptez qu'il n'y ait pas de garanties, seulement des mots pour l'inspiration et le bien-être émotionnel.</li></ul>",
    privacyTitle: "Politique de Confidentialité",
    privacyText: "<p>Nous respectons votre vie privée (en accord avec le RGPD et le CCPA).</p><ul><li><strong>Données Anonymes:</strong> Seuls la langue choisie et l'état de votre session sont enregistrés localement.</li><li><strong>Cookies et Publicités:</strong> Nous utilisons Google Analytics et Google AdSense anonymement et de manière non-intrusive.</li></ul>",
    blogTitle: "Blog Tiresias",
    blogText: "<p>La section Blog est en construction. Vous y trouverez bientôt des articles sur le développement personnel, la connaissance de soi et la quête de sérénité.</p>",
    blog: "Blog"
  },
  de: {
    aboutTitle: "Über Tiresias",
    aboutIntro: "<p>Tiresias ist ein digitaler Raum für Innehalten und Achtsamkeit. Unsere Mission ist es, Mikromomente der Reflexion und Gelassenheit im hypervernetzten Alltag zu bieten.</p>",
    mythology: "<h3>Wer war Tiresias?</h3><p>In der griechischen Mythologie war Tiresias ein blinder Seher. In unserem Projekt symbolisiert diese Figur die <strong>Selbsterkenntnis</strong> und den tiefen Blick ins eigene Innere.</p>",
    howItWorks: "<h3>Wie es funktioniert?</h3><p>Es ist ein Instrument zur Kontemplation. Wir machen keine Vorhersagen. Die Nachrichten sollen <strong>emotionalen Trost</strong>, Hoffnung und Unterstützung in schwierigen Zeiten und bei Lebensübergängen bieten.</p>",
    faqTitle: "<h3>Oft gestellte Fragen (FAQ)</h3>",
    faqs: [
      { q: "Sagt Tiresias die Zukunft voraus?", a: "Nein. Das Projekt konzentriert sich auf die Gegenwart und bietet Reflexion für die persönliche Entwicklung." },
      { q: "Ist Tiresias religiös?", a: "Nein. Das Projekt ist völlig neutral und an keine Dogmen oder Religionen gebunden." },
      { q: "Ersetzt Tiresias professionelle Hilfe?", a: "Absolut nicht. Suchen Sie bei emotionaler Not psychologische Hilfe." },
      { q: "Kann es bei Trauer oder nach einer Trennung helfen?", a: "Ja. Die unterstützenden Botschaften können eine sanfte Begleitung bei Neuanfängen sein."}
    ],
    termsTitle: "Nutzungsbedingungen",
    termsText: "<p>Durch die Nutzung von Tiresias stimmen Sie zu, dass diese Plattform einen <strong>ausschließlich freizeitlichen und reflexiven</strong> Charakter hat.</p><ul><li>Die Nutzung erfolgt auf eigene Verantwortung.</li><li><strong>Keine professionelle Beratung:</strong> Wir ersetzen keine Therapie oder medizinische Behandlung.</li><li>Die Texte dienen ausschließlich dem <strong>emotionalen Wohlbefinden</strong> und der Inspiration.</li></ul>",
    privacyTitle: "Datenschutzrichtlinie",
    privacyText: "<p>Wir nehmen Ihren Datenschutz ernst (gemäß DSGVO).</p><ul><li><strong>Anonyme Daten:</strong> Nur die ausgewählte Sprache und der Sitzungsverlauf werden lokal gespeichert.</li><li><strong>Cookies & Werbung:</strong> Wir verwenden Google Analytics und Google AdSense anonym und unaufdringlich.</li></ul>",
    blogTitle: "Tiresias Blog",
    blogText: "<p>Der Blog befindet sich derzeit im Aufbau. Bald finden Sie hier Artikel über Selbsterkenntnis, Kontemplation und innere Stärke.</p>",
    blog: "Blog"
  },
  it: {
    aboutTitle: "A proposito di Tiresias",
    aboutIntro: "<p>Tiresias è uno spazio digitale per pause e consapevolezza, incentrato sulla psicologia positiva. Offriamo momenti di riflessione e serenità nella routine quotidiana.</p>",
    mythology: "<h3>Chi era Tiresias?</h3><p>Nella mitologia greca, Tiresia era un profeta cieco. Oggi simboleggia l'<strong>autoconoscenza</strong> e la capacità di guardarsi dentro per affrontare la vita.</p>",
    howItWorks: "<h3>Come funziona?</h3><p>Non facciamo previsioni. Le nostre frasi offrono <strong>conforto emotivo</strong>, speranza e sostegno per trovare forza interiore durante tempi difficili, chiusure e nuovi inizi.</p>",
    faqTitle: "<h3>Domande Comuni (FAQ)</h3>",
    faqs: [
      { q: "Tiresias prevede il futuro?", a: "No. Il progetto si concentra sul presente per il tuo sviluppo personale." },
      { q: "Tiresias ha legami religiosi?", a: "Assolutamente no. È uno spazio neutrale e non affiliato." },
      { q: "Può sostituire uno psicologo?", a: "No. Non sostituiamo mai l'aiuto professionale o terapeutico." },
      { q: "Aiuta durante un lutto o una rottura?", a: "Sì. Troverai messaggi di conforto emotivo pensati per darti un abbraccio di luce."}
    ],
    termsTitle: "Termini d'Uso",
    termsText: "<p>Utilizzando Tiresias, accetti la sua natura <strong>esclusivamente riflessiva e ludica</strong>.</p><ul><li>La responsabilità dell'uso è individuale.</li><li><strong>Nessun consiglio medico:</strong> Per gravi difficoltà, consulta un professionista.</li><li>I messaggi supportano il tuo <strong>benessere psicologico</strong> senza pretese cliniche.</li></ul>",
    privacyTitle: "Informativa sulla Privacy",
    privacyText: "<p>Rispettiamo la normativa sulla privacy (GDPR, CCPA).</p><ul><li><strong>Dati:</strong> Solo la lingua e lo stato locale vengono memorizzati nel tuo browser.</li><li><strong>Cookie:</strong> Utilizziamo Google Analytics ed i cookie di Google AdSense in modo sicuro e non invasivo.</li></ul>",
    blogTitle: "Blog Tiresias",
    blogText: "<p>La sezione Blog è in fase di realizzazione. Presto offrirà riflessioni sull'autoconoscenza e la serenità interiore.</p>",
    blog: "Blog"
  }
};

// Map unhandled languages to English as fallback, but ideally they'd be translated properly. To keep size manageable and error-free, fallback them.
const fallbacks = ["ja", "ko", "zh", "hi", "ar", "ru", "tr", "nl", "pl", "uk", "id"];
for (const lang of fallbacks) {
  languages[lang] = languages.en; 
}

const buildAboutContent = (langData) => {
  let f_html = "<ul>";
  for (let f of langData.faqs) {
    f_html += "<li><strong>" + f.q + "</strong><br>" + f.a + "</li>";
  }
  f_html += "</ul>";
  return langData.aboutIntro + langData.mythology + langData.howItWorks + langData.faqTitle + f_html;
};

let html = fs.readFileSync('index.html', 'utf8');

const regex = /const i18n = (\{[\s\S]*?\n\s{6}\});\n/m;
const match = html.match(regex);
if (match) {
  let i18nObj;
  try {
    const fn = new Function('return ' + match[1]);
    i18nObj = fn();
  } catch(e) {
    console.error("Could not parse i18n");
    process.exit(1);
  }
  
  for (let lang of Object.keys(i18nObj)) {
    let trans = languages[lang] || languages.en;
    
    i18nObj[lang].aboutTitle = trans.aboutTitle;
    i18nObj[lang].aboutText = buildAboutContent(trans);
    i18nObj[lang].termsTitle = trans.termsTitle;
    i18nObj[lang].termsText = trans.termsText;
    i18nObj[lang].privacyTitle = trans.privacyTitle;
    i18nObj[lang].privacyText = trans.privacyText;
    i18nObj[lang].blogTitle = trans.blogTitle;
    i18nObj[lang].blogText = trans.blogText;
    i18nObj[lang].blog = trans.blog;
  }
  
  const serialized = JSON.stringify(i18nObj, null, 2);
  let replacement = "const i18n = " + serialized + ";\n";
  
  html = html.replace(match[0], replacement);
  fs.writeFileSync('index.html', html);
  console.log("Translations successfully updated.");
} else {
  console.log("Could not find i18n object.");
}

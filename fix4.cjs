const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// --- 1. LANGUAGE SELECTOR ---

const desktopHeaderOld = `<header>
          <h1
            class="brand-title-text"
            id="mainTitle"
            onclick="unlockWithTaps()"
            style="cursor: pointer"
            title="Clique para acessar opções"
          >
            Tiresias
          </h1>`;

const dropdownMenuOptions = `
              <div class="lang-option" onclick="switchLanguage('en')">English</div>
              <div class="lang-option" onclick="switchLanguage('es')">Español</div>
              <div class="lang-option" onclick="switchLanguage('pt-BR')">Português</div>
              <div class="lang-option" onclick="switchLanguage('fr')">Français</div>
              <div class="lang-option" onclick="switchLanguage('de')">Deutsch</div>
              <div class="lang-option" onclick="switchLanguage('it')">Italiano</div>
              <div class="lang-option" onclick="switchLanguage('ja')">日本語</div>
              <div class="lang-option" onclick="switchLanguage('ko')">한국어</div>
              <div class="lang-option" onclick="switchLanguage('zh-CN')">中文</div>
              <div class="lang-option" onclick="switchLanguage('hi')">हिन्दी</div>
              <div class="lang-option" onclick="switchLanguage('ar')">العربية</div>
`;

const desktopLangSelector = `
          <div class="header-lang-wrapper desktop-lang-select">
            <div id="desktopLangTrigger" class="lang-trigger" onclick="toggleLangMenu(event, 'desktopLangDropdown')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span class="current-lang-icon font-sans text-xs tracking-wider font-semibold">EN</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div id="desktopLangDropdown" class="lang-dropdown-menu">
${dropdownMenuOptions}
            </div>
          </div>`;

const desktopHeaderNew = `<header>
${desktopLangSelector}
          <h1
            class="brand-title-text"
            id="mainTitle"
            onclick="unlockWithTaps()"
            style="cursor: pointer"
            title="Clique para acessar opções"
          >
            Tiresias
          </h1>`;

// Replace desktop header
if (html.includes(desktopHeaderOld)) {
    html = html.replace(desktopHeaderOld, desktopHeaderNew);
} else {
    // maybe it already has some lang wrapper?
    if (html.includes('<div class="header-lang-wrapper" style="position: absolute; left: 25px; top: 15px; z-index: 100;">')) {
         // remove the old one first.. not gonna happen because I deleted apply.cjs
         // the desktopHeaderOld should match. I'll check if it does.
    }
}

// Mobile Layout Header:
const mobileHeaderStartRegex = /<div\s+class="w-full mt-0 h-\[\d+\.?\d*px\] bg-\[#050811\]\/90 border-b border-\[#e2c079\]\/30 pt-\[env\(safe-area-inset-top\)\] pb-0 px-6 flex justify-between items-center backdrop-blur-lg">\s*<div class="relative flex items-center justify-center z-50">\s*<div onclick="toggleLangMenu\(event, 'mobLangDropdown'\)" class="w-10 h-10 rounded-full border border-\[#e2c079\]\/40 flex items-center justify-center bg-\[#0e1526\]\/40 backdrop-blur-\[2px\] transition-all active:scale-90 shadow-\[0_0_10px_rgba\(226,192,121,0\.2\)\] cursor-pointer text-\[#e2c079\]">\s*<span class="current-lang-icon font-sans text-xs tracking-wider font-semibold">EN<\/span>\s*<\/div>/m;

const mobileHeaderNew = `<div class="w-full mt-0 h-[53.2px] bg-[#050811]/90 border-b border-[#e2c079]/30 pt-[env(safe-area-inset-top)] pb-0 px-6 flex justify-between items-center backdrop-blur-lg">
          <div class="flex-1 flex justify-start">
            <div class="relative flex items-center justify-center z-50">
              <div onclick="toggleLangMenu(event, 'mobLangDropdown')" class="lang-trigger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span class="current-lang-icon font-sans text-[11px] sm:text-xs tracking-wider font-semibold">EN</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>`;

html = html.replace(mobileHeaderStartRegex, mobileHeaderNew);

// We need to fix the end tags for mobile header
// old structure:
// <div id="mobLangDropdown"...>...</div>
// </div>
// <h1 ... >TIRESIAS</h1>
// <button onclick="AudioManager.toggleMute()"...>...</button>
// </div> <!-- end of the header flex -->

// Now we need to wrap h1 correctly and button correctly.
if (html.includes('class="text-3xl sm:text-4xl tracking-[0.2em] font-medium text-[#e2c079] drop-shadow-[0_0_15px_rgba(226,192,121,0.5)] cursor-pointer"')) {
    html = html.replace(/<\/div>\s*<h1/g, '</div></div><h1');
    html = html.replace(/<button\s*onclick="AudioManager\.toggleMute\(\)"/g, '<div class="flex-1 flex justify-end"><button onclick="AudioManager.toggleMute()"');
    // the closing for this is `<svg id="icon-unmuted-mob" ... </svg></button></div>` but it doesn't have the `</div>` originally.
    html = html.replace(/<\/button>\s*<\/div>\s*<!-- -- STAGE LAYER -- -->/g, '</button></div></div>\n        <!-- -- STAGE LAYER -- -->');
}


// Add CSS
const cssString = `
      .header-lang-wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 24px;
        z-index: 100;
        margin: 0;
      }
      
      @media (max-width: 768px) {
        .desktop-lang-select {
            display: none !important;
        }
      }
      
      @media (min-width: 1200px) {
        .header-lang-wrapper {
          left: 40px;
        }
      }

      .lang-trigger {
        background: rgba(10, 11, 22, 0.4);
        border: 1px solid rgba(227, 193, 111, 0.2);
        color: #e3c16f;
        padding: 6px 12px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        font-family: 'Inter', ui-sans-serif, system-ui;
        user-select: none;
      }
      .lang-trigger:hover {
        background: rgba(227, 193, 111, 0.15);
        border-color: rgba(227, 193, 111, 0.4);
        transform: scale(1.05);
      }
      
      .lang-dropdown-menu {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        background: rgba(10, 11, 22, 0.95);
        border: 1px solid rgba(227, 193, 111, 0.3);
        border-radius: 12px;
        min-width: 120px;
        display: none;
        flex-direction: column;
        padding: 6px 0;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.8);
        z-index: 200;
      }
      
      .lang-dropdown-menu.active {
        display: flex;
        animation: fadeIn 0.2s ease-out;
      }
      
      #mobLangDropdown {
         /* Mobile override just in case it doesn't match standard classes */
      }
      
      .lang-option {
        padding: 8px 16px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        text-align: left;
        font-family: 'Inter', ui-sans-serif, system-ui;
      }
      .lang-option:hover {
        background: rgba(227, 193, 111, 0.15);
        color: #e3c16f;
      }
`;
html = html.replace('</style>', cssString + '\n</style>');

// Fix the style for mobLangDropdown so it is controlled by .active
// We must remove 'hidden' class from it actually, but flex-col hidden are hardcoded `class="..."` on it
html = html.replace('<div id="mobLangDropdown" class="absolute top-[120%] left-0 w-32 bg-[#0a0b16]/95 border border-[#e2c079]/30 rounded-xl py-2 flex-col hidden shadow-[0_8px_25px_rgba(0,0,0,0.8)] backdrop-blur-md">',
'<div id="mobLangDropdown" class="lang-dropdown-menu">');


// Fix the JS toggle logic
if(html.includes(/function toggleLangMenu/)) {
    // Do nothing, wait, `toggleLangMenu` is already in script? Let's check using replace over the whole logic block.
}

html = html.replace(/function toggleLangMenu\(e, dropdownId = 'langDropdown'\) \{[\s\S]*?\}/m, `function toggleLangMenu(e, dropdownId) {
        e.stopPropagation();
        const d = document.getElementById(dropdownId);
        if(d) {
          d.classList.toggle('active');
        }
      }`);

html = html.replace(/window\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);/m, `window.addEventListener('click', () => {
        const d1 = document.getElementById('desktopLangDropdown');
        if(d1 && d1.classList.contains('active')) d1.classList.remove('active');
        const d2 = document.getElementById('mobLangDropdown');
        if(d2 && d2.classList.contains('active')) d2.classList.remove('active');
      });`);


// --- 2. REDUCE TRANSLATED MESSAGE FONT SIZES ---

// Desktop Wisdom Text:
html = html.replace('font-size: clamp(0.9rem, min(4vw, 1.2rem), 1.2rem);', 'font-size: clamp(0.7rem, min(3.5vw, 1.0rem), 1.0rem);');
html = html.replace('line-height: 1.8;', 'line-height: 1.6;');

// Tablet query for message
const wisdomTabletMatch = html.match(/@media \(min-width: 768px\) \{[\s\S]*?\.wisdom-text \{[\s\S]*?font-size: \w+\([^)]+\);/);
if (wisdomTabletMatch) {
    html = html.replace('font-size: clamp(1rem, min(3vw, 1.3rem), 1.3rem);', 'font-size: clamp(0.85rem, min(2.5vw, 1.05rem), 1.05rem); letter-spacing: 0.15em;');
}

const wisdomDesktopMatch = html.match(/@media \(min-width: 1200px\) \{[\s\S]*?\.wisdom-text \{[\s\S]*?font-size: \w+\([^)]+\);/);
if (wisdomDesktopMatch) {
    html = html.replace('font-size: clamp(1.2rem, min(2vw, 1.4rem), 1.4rem);', 'font-size: clamp(0.9rem, min(1.5vw, 1.05rem), 1.1rem); letter-spacing: 0.15em;');
}

// Ensure the mobile-only texts (which can also burst bounds!) are slightly smaller
html = html.replace('font-size: 0.95rem !important;', 'font-size: 0.8rem !important; letter-spacing: 0.2em !important;'); // .desktop-text sizing up
html = html.replace('font-size: 13px !important;', 'font-size: 11px !important; letter-spacing: 0.15em !important;'); // .desktop-only-text
// .mobile-text inside .instruction
html = html.replace('font-size: 0.8rem;', 'font-size: 0.65rem;');

// Mobile instruction overlay (Tailwind class)
html = html.replace('text-[11px] sm:text-xs tracking-[0.2em]', 'text-[9px] sm:text-[10px] tracking-[0.15em]');


// --- 3. REDUCE FOOTER TEXT SIZES ---

// Desktop footer `.legal-nav a`
html = html.replace('font-size: 0.8rem;', 'font-size: 0.65rem; letter-spacing: 0.1em;');
// Desktop footer `.copyright`
html = html.replace('font-size: 0.75rem;', 'font-size: 0.6rem; letter-spacing: 0.05em;');

// Mobile footer `<nav class="flex gap-[20px] mb-[8px]"`
html = html.replace('text-xs tracking-[0.1em]', 'text-[9px] tracking-[0.1em]');
html = html.replace('text-[0.7rem] tracking-[0.05em]', 'text-[8px] tracking-[0.05em]');


fs.writeFileSync('index.html', html);
console.log("Fixes applied successfully!");

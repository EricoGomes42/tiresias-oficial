const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. ADD LANGUAGE SELECTOR TO BOTH DESKTOP AND MOBILE HEADERS

// In desktop header:
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
html = html.replace(desktopHeaderOld, desktopHeaderNew);


// Mobile Layout Header:
const mobileHeaderTarget = `<div class="relative flex items-center justify-center z-50">
            <div onclick="toggleLangMenu(event, 'mobLangDropdown')" class="w-10 h-10 rounded-full border border-[#e2c079]/40 flex items-center justify-center bg-[#0e1526]/40 backdrop-blur-[2px] transition-all active:scale-90 shadow-[0_0_10px_rgba(226,192,121,0.2)] cursor-pointer text-[#e2c079]">
              <span class="current-lang-icon font-sans text-xs tracking-wider font-semibold">EN</span>
            </div>
            <div id="mobLangDropdown" class="absolute top-[120%] left-0 w-32 bg-[#0a0b16]/95 border border-[#e2c079]/30 rounded-xl py-2 flex-col hidden shadow-[0_8px_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('en')">English</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('es')">Español</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('pt-BR')">Português</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('fr')">Français</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('de')">Deutsch</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('it')">Italiano</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('ja')">日本語</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('ko')">한국어</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('zh-CN')">中文</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('hi')">हिन्दी</div>
              <div class="px-4 py-2 text-[0.85rem] text-white/80 font-sans cursor-pointer hover:bg-[#e2c079]/15 hover:text-[#e2c079] transition-colors" onclick="switchLanguage('ar')">العربية</div>
            </div>
          </div>`;

const mobileHeaderNew = `<div class="relative flex items-center justify-center z-50">
            <div onclick="toggleLangMenu(event, 'mobLangDropdown')" class="lang-trigger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span class="current-lang-icon font-sans text-[11px] sm:text-xs tracking-wider font-semibold">EN</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div id="mobLangDropdown" class="lang-dropdown-menu">
${dropdownMenuOptions}
            </div>
          </div>`;

html = html.replace(mobileHeaderTarget, mobileHeaderNew);

// Add CSS for lang selectors
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

// Fix the logic toggle
html = html.replace(/function toggleLangMenu\(e, dropdownId = 'langDropdown'\) {[\s\S]*?\}/m, `function toggleLangMenu(e, dropdownId) {
        e.stopPropagation();
        const d = document.getElementById(dropdownId);
        if(d) {
          d.classList.toggle('active');
        }
      }`);

html = html.replace(/window\.addEventListener\('click', \(\) => {[\s\S]*?\}\);/m, `window.addEventListener('click', () => {
        const d1 = document.getElementById('desktopLangDropdown');
        if(d1 && d1.classList.contains('active')) d1.classList.remove('active');
        const d2 = document.getElementById('mobLangDropdown');
        if(d2 && d2.classList.contains('active')) d2.classList.remove('active');
      });`);


// 2. REDUCE TRANSLATED MESSAGE FONT SIZES
// Base Desktop reducing 25% (was min(2vw, 1.4rem), about 1rem now)
// Tablet reducing 20% (was min(3vw, 1.3rem), about 1rem now)
// Mobile reducing 15% (was min(4vw, 1.2rem), about 0.85rem now)

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
// In the translation JSON, the instruction itself uses \`<span class="desktop-text">\` styles. Those are inside `.instruction`.
html = html.replace('font-size: 0.95rem !important;', 'font-size: 0.8rem !important; letter-spacing: 0.2em !important;'); // .desktop-text sizing up
html = html.replace('font-size: 13px !important;', 'font-size: 11px !important; letter-spacing: 0.15em !important;'); // .desktop-only-text
// .mobile-text inside .instruction
html = html.replace('font-size: 0.8rem;', 'font-size: 0.65rem;');

// Mobile instruction overlay (Tailwind class)
html = html.replace('text-[11px] sm:text-xs tracking-[0.2em]', 'text-[9px] sm:text-[10px] tracking-[0.15em]');


// 3. REDUCE FOOTER TEXT SIZES
// Desktop footer `.legal-nav a`
html = html.replace('font-size: 0.8rem;', 'font-size: 0.65rem; letter-spacing: 0.1em;');
// Desktop footer `.copyright`
html = html.replace('font-size: 0.75rem;', 'font-size: 0.6rem; letter-spacing: 0.05em;');

// Mobile footer `<nav class="flex gap-[20px] mb-[8px]"`
html = html.replace('text-xs tracking-[0.1em]', 'text-[10px] tracking-[0.1em]');
html = html.replace('text-[0.7rem] tracking-[0.05em]', 'text-[9px] tracking-[0.05em]');

fs.writeFileSync('index.html', html);
console.log("Corrections applied!");

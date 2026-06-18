const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Desktop Header Language Selector
const headerRegex = /<header>\s*<h1\s+class="brand-title-text"\s+id="mainTitle"\s+onclick="unlockWithTaps\(\)"\s+style="cursor: pointer"\s+title="Clique para acessar opções"\s*>\s*Tiresias\s*<\/h1>/;

const desktopLangSelector = `<div class="header-lang-wrapper desktop-lang-select">
            <div id="desktopLangTrigger" class="lang-trigger" onclick="toggleLangMenu(event, 'desktopLangDropdown')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span class="current-lang-icon font-sans text-xs tracking-wider font-semibold">EN</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div id="desktopLangDropdown" class="lang-dropdown-menu">
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
            </div>
          </div>`;

const desktopHeaderNew = `<header>
          ` + desktopLangSelector + `
          <h1
            class="brand-title-text"
            id="mainTitle"
            onclick="unlockWithTaps()"
            style="cursor: pointer"
            title="Clique para acessar opções"
          >
            Tiresias
          </h1>`;

html = html.replace(headerRegex, desktopHeaderNew);

// 2. Mobile Layout Header
const mobHeaderSearchReg = /<div class="relative flex items-center justify-center z-50">\s*<div onclick="toggleLangMenu\(event, 'mobLangDropdown'\)" class="w-10 h-10 rounded-full border border-\[#e2c079\]\/40 flex items-center justify-center bg-\[#0e1526\]\/40 backdrop-blur-\[2px\] transition-all active:scale-90 shadow-\[0_0_10px_rgba\(226,192,121,0\.2\)\] cursor-pointer text-\[#e2c079\]">\s*<span class="current-lang-icon font-sans text-xs tracking-wider font-semibold">EN<\/span>\s*<\/div>\s*<div id="mobLangDropdown".*?<\/div>\s*<\/div>\s*<\/div>/s;

// We will find the exact string indices.
const anchor = '<!-- -- HEADER -- -->';
const startIdx = html.indexOf(anchor);

if (startIdx !== -1) {
    let block = html.substring(startIdx, startIdx + 2000);
    const dropdownEndStr = '</div>\\n          </div>'; // Note: if \n is encoded
    const dropdownEndStrReal = '</div>\\n          </div>'.replace('\\\\n', '\\n'); 
}

// Better way to do the mobile replace:
// It's the only <div class="w-full mt-0 ... pt-[env(safe-area-inset-top)] ... flex justify-between"> block.
let mobRegex2 = /<!-- -- HEADER -- -->\s*<div[\s\S]*?<div class="relative flex items-center justify-center z-50">[\s\S]*?<!-- -- STAGE LAYER -- -->/m;

let result = html.match(mobRegex2);
if (result) {
    const matchedStr = result[0];
    const newHeader = `<!-- -- HEADER -- -->
        <div class="w-full mt-0 h-[53px] bg-[#050811]/90 border-b border-[#e2c079]/30 pt-[env(safe-area-inset-top)] pb-0 px-6 flex justify-between items-center backdrop-blur-lg">
          
          <div class="flex-1 flex justify-start">
            <div class="relative flex items-center justify-center z-50">
              <div onclick="toggleLangMenu(event, 'mobLangDropdown')" class="lang-trigger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span class="current-lang-icon font-sans text-[11px] sm:text-xs tracking-[0.1em] font-semibold">EN</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div id="mobLangDropdown" class="lang-dropdown-menu">
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
              </div>
            </div>
          </div>
          
          <h1
            onclick="unlockWithTaps()"
            class="text-3xl sm:text-4xl tracking-[0.2em] font-medium text-[#e2c079] drop-shadow-[0_0_15px_rgba(226,192,121,0.5)] cursor-pointer"
          >
            TIRESIAS
          </h1>
          
          <div class="flex-1 flex justify-end">
            <button
              onclick="AudioManager.toggleMute()"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#e2c079]/40 flex items-center justify-center bg-[#0e1526]/40 backdrop-blur-[2px] transition-all active:scale-90 shadow-[0_0_10px_rgba(226,192,121,0.2)]"
              aria-label="Toggle sound"
            >
              <svg
                id="icon-unmuted-mob"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="pointer-events-none text-[#e2c079]"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path
                  d="M15.54 8.46a5 5 0 0 1 0 7.07"
                ></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- -- STAGE LAYER -- -->`;

    html = html.replace(matchedStr, newHeader);
}

// 3. Add CSS for lang selectors
const cssString = `<style>
      .header-lang-wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 20px;
        z-index: 100;
        margin: 0;
      }
      @media (min-width: 1200px) {
        .header-lang-wrapper {
          left: 40px;
        }
      }
      .lang-trigger {
        background: rgba(14, 21, 38, 0.6);
        border: 1px solid rgba(226, 192, 121, 0.4);
        color: #e2c079;
        padding: 4px 10px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        font-family: 'Inter', ui-sans-serif, system-ui;
        user-select: none;
        box-shadow: 0 0 10px rgba(226,192,121,0.2);
      }
      .lang-trigger:hover {
        background: rgba(226, 192, 121, 0.15);
        border-color: rgba(226, 192, 121, 0.6);
      }
      .lang-trigger:active {
        transform: scale(0.95);
      }
      .lang-dropdown-menu {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        background: rgba(10, 11, 22, 0.95);
        border: 1px solid rgba(226, 192, 121, 0.3);
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
        font-size: 0.85rem;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        text-align: left;
        font-family: 'Inter', ui-sans-serif, system-ui;
      }
      .lang-option:hover {
        background: rgba(226, 192, 121, 0.15);
        color: #e2c079;
      }
`;
html = html.replace('<style>', cssString);

// 4. Fix JS lang toggle
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


// 5. REDUCE FONT SIZES
// Desktop Wisdom Text:
html = html.replace('font-size: clamp(0.9rem, min(4vw, 1.2rem), 1.2rem);', 'font-size: clamp(0.65rem, min(3vw, 0.95rem), 0.95rem); letter-spacing: 0.12em;');
html = html.replace('line-height: 1.8;', 'line-height: 1.6;');

// Tablet query for message
const wisdomTabletMatch = html.match(/@media \(min-width: 768px\) \{[\s\S]*?\.wisdom-text \{[\s\S]*?font-size: (\w+|\d+\.?\d*[a-zA-Z%]+)[^{}]*?\}/);
if (wisdomTabletMatch) {
    html = html.replace(/@media \(min-width: 768px\) \{[\s\S]*?\.wisdom-text \{[\s\S]*?font-size:[^{}]*?\}/, 
`@media (min-width: 768px) {
        .wisdom-text {
          font-size: clamp(0.8rem, min(2.5vw, 1.05rem), 1.05rem);
          line-height: 1.8;
          max-width: 550px;
        }`);
}

const wisdomDesktopMatch = html.match(/@media \(min-width: 1200px\) \{[\s\S]*?\.wisdom-text \{[\s\S]*?font-size: \w+\([^)]+\);/);
if (wisdomDesktopMatch) {
    html = html.replace(/@media \(min-width: 1200px\) \{[\s\S]*?\.wisdom-text \{[\s\S]*?font-size:[^{}]*?\}/, 
`@media (min-width: 1200px) {
        .wisdom-text {
          font-size: clamp(0.9rem, min(1.5vw, 1.1rem), 1.1rem);
          line-height: 1.9;
          letter-spacing: 0.15em;
        }`);
    
}

// Ensure the mobile-only texts (which can also burst bounds!) are slightly smaller
html = html.replace('font-size: 0.95rem !important;', 'font-size: 0.72rem !important; letter-spacing: 0.2rem !important;'); // desktop instruction
html = html.replace('font-size: 13px !important;', 'font-size: 10.5px !important; letter-spacing: 0.15em !important;'); // desktop-only
html = html.replace('font-size: 0.8rem;', 'font-size: 0.65rem;'); // mobile-text instruction inside `.instruction`

// Mobile instruction overlay Tailwind class
html = html.replace('text-[11px] sm:text-xs tracking-[0.2em]', 'text-[9.5px] sm:text-[10px] tracking-[0.15em]');


// 6. REDUCE FOOTER TEXT SIZES

// Desktop footer `.legal-nav a`
html = html.replace('font-size: 0.8rem;', 'font-size: 0.65rem; letter-spacing: 0.1em;');
// Desktop footer `.copyright`
html = html.replace('font-size: 0.75rem;', 'font-size: 0.55rem; letter-spacing: 0.08em;');

// Mobile footer `<nav class="flex gap-[20px] mb-[8px]"`
html = html.replace('text-xs tracking-[0.1em]', 'text-[10px] tracking-[0.1em]');
html = html.replace('text-[0.7rem] tracking-[0.05em]', 'text-[8.5px] tracking-[0.05em]');


// Hide the ugly `langSelect` in footer logic entirely since we replaced it with header icons
html = html.replace('<div class="lang-selector-container">', '<div class="lang-selector-container" style="display:none;">');

fs.writeFileSync('index.html', html);
console.log("Corrections Script Executed!");

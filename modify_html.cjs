const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update legal-nav desktop
html = html.replace(
  /<nav class="legal-nav">\s*<a onclick="openModal\('modalAbout'\)">About<\/a>\s*<span>\|<\/span>\s*<a onclick="openModal\('modalTerms'\)">Terms<\/a>\s*<span>\|<\/span>\s*<a onclick="openModal\('modalPrivacy'\)">Privacy<\/a>\s*<\/nav>/g,
  `<nav class="legal-nav">
            <a onclick="openModal('modalAbout')">About</a>
            <span>|</span>
            <a onclick="openModal('modalTerms')">Terms</a>
            <span>|</span>
            <a onclick="openModal('modalPrivacy')">Privacy</a>
            <span>|</span>
            <a onclick="openModal('modalBlog')">Blog</a>
          </nav>`
);

// Update legal-nav mobile
html = html.replace(
  /<nav class="flex gap-\[8px\] mb-\[8px\]">([\s\S]*?)<\/nav>/,
  `<nav class="flex gap-[8px] mb-[8px]">
            <a
              onclick="openModal('modalAbout')"
              class="text-[0.6rem] tracking-[0.15em] text-[rgba(226,192,121,0.8)] uppercase cursor-pointer"
              >About</a
            >
            <span class="text-[0.6rem] text-[rgba(226,192,121,0.8)] opacity-50">|</span>
            <a
              onclick="openModal('modalTerms')"
              class="text-[0.6rem] tracking-[0.15em] text-[rgba(226,192,121,0.8)] uppercase cursor-pointer"
              >Terms</a
            >
            <span class="text-[0.6rem] text-[rgba(226,192,121,0.8)] opacity-50">|</span>
            <a
              onclick="openModal('modalPrivacy')"
              class="text-[0.6rem] tracking-[0.15em] text-[rgba(226,192,121,0.8)] uppercase cursor-pointer"
              >Privacy</a
            >
            <span class="text-[0.6rem] text-[rgba(226,192,121,0.8)] opacity-50">|</span>
            <a
              onclick="openModal('modalBlog')"
              class="text-[0.6rem] tracking-[0.15em] text-[rgba(226,192,121,0.8)] uppercase cursor-pointer"
              >Blog</a
            >
          </nav>`
);

// 2. Modals structure change (p -> div)
html = html.replace(/<div id="modalAbout" class="glass-modal">[\s\S]*?<div id="modalTerms" class="glass-modal">/, 
  `<div id="modalAbout" class="glass-modal">
      <div class="modal-body">
        <button class="btn-close" onclick="closeModal('modalAbout')">
          &times;
        </button>
        <h2>About Tiresias</h2>
        <div id="aboutContent"></div>
      </div>
    </div>
    <div id="modalTerms" class="glass-modal">`
);

html = html.replace(/<div id="modalTerms" class="glass-modal">[\s\S]*?<div id="modalPrivacy" class="glass-modal">/, 
  `<div id="modalTerms" class="glass-modal">
      <div class="modal-body">
        <button class="btn-close" onclick="closeModal('modalTerms')">
          &times;
        </button>
        <h2>Termos de Uso</h2>
        <div id="termsContent"></div>
      </div>
    </div>
    <div id="modalPrivacy" class="glass-modal">`
);

html = html.replace(/<div id="modalPrivacy" class="glass-modal">[\s\S]*?<!-- Elementos de Áudio -->/, 
  `<div id="modalPrivacy" class="glass-modal">
      <div class="modal-body">
        <button class="btn-close" onclick="closeModal('modalPrivacy')">
          &times;
        </button>
        <h2>Política de Privacidade</h2>
        <div id="privacyContent"></div>
      </div>
    </div>
    <div id="modalBlog" class="glass-modal">
      <div class="modal-body">
        <button class="btn-close" onclick="closeModal('modalBlog')">
          &times;
        </button>
        <h2>Blog</h2>
        <div id="blogContent"></div>
      </div>
    </div>
    <!-- Elementos de Áudio -->`
);

// Modify JS loader
html = html.replace(/const abP = document\.querySelector\("#modalAbout p"\); if\(abP\) abP\.innerText = t\.aboutText;/g, 
  `const abP = document.getElementById("aboutContent"); if(abP) abP.innerHTML = t.aboutText;`
);
html = html.replace(/const tP = document\.querySelector\("#modalTerms p"\); if\(tP\) tP\.innerText = t\.termsText;/g, 
  `const tP = document.getElementById("termsContent"); if(tP) tP.innerHTML = t.termsText;`
);
html = html.replace(/const pP = document\.querySelector\("#modalPrivacy p"\); if\(pP\) pP\.innerText = t\.privacyText;/g, 
  `const pP = document.getElementById("privacyContent"); if(pP) pP.innerHTML = t.privacyText;
        const blT = document.querySelector("#modalBlog h2"); if(blT) blT.innerText = t.blogTitle;
        const blP = document.getElementById("blogContent"); if(blP) blP.innerHTML = t.blogText;
        document.querySelectorAll("a[onclick*='modalBlog']").forEach(e => e.innerText = t.blog);`
);

fs.writeFileSync('index.html', html);
console.log('HTML and JS updated');

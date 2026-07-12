const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldCSS = `
      .pt-affiliate-modal .pt-affiliate-content {
        position: relative;
        max-width: 95vw;
        max-height: 95vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .pt-affiliate-modal .pt-affiliate-content picture {
        display: block;
      }
      .pt-affiliate-modal .pt-affiliate-content img {
        max-width: 100%;
        max-height: 95vh;
        object-fit: contain;
        border-radius: 12px;
      }
      .pt-affiliate-modal .pt-affiliate-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 15%;
        height: 15%;
        cursor: pointer;
        z-index: 10;
      }
      .pt-affiliate-modal .pt-affiliate-link {
        position: absolute;
        top: 15%;
        left: 0;
        width: 100%;
        height: 85%;
        z-index: 5;
        cursor: pointer;
        display: block;
      }
`;

const newCSS = `
      .pt-affiliate-modal .pt-affiliate-content {
        position: relative;
        max-width: 95vw;
        max-height: 95vh;
        display: inline-block; /* Crucial to shrink-wrap the image exactly */
        margin: auto; /* Center in modal */
      }
      .pt-affiliate-modal .pt-affiliate-content picture {
        display: block;
      }
      .pt-affiliate-modal .pt-affiliate-content img {
        max-width: 95vw;
        max-height: 95vh;
        object-fit: contain;
        display: block;
        border-radius: 12px;
      }
      
      .pt-affiliate-hotspot {
        position: absolute;
        cursor: pointer;
        /* background: rgba(255,0,0,0.15); outline: 2px solid red; */
      }
      
      .pt-affiliate-hotspot-cta {
        z-index: 2;
      }
      .pt-affiliate-hotspot-secondary {
        z-index: 3;
      }
      .pt-affiliate-hotspot-close {
        z-index: 4;
        top: 0; right: 0; width: 10%; height: 10%;
      }

      /* Desktop Defaults */
      .pt-affiliate-hotspot-cta { top: 83%; left: 13%; width: 36%; height: 8%; }
      .pt-affiliate-hotspot-secondary { top: 83%; left: 51.5%; width: 32.5%; height: 8%; }
      
      /* Part 2 Desktop */
      .part-2 .pt-affiliate-hotspot-cta { top: 79%; left: 7.5%; width: 31.5%; height: 10.5%; }
      .part-2 .pt-affiliate-hotspot-secondary { top: 79%; left: 41%; width: 29%; height: 10.5%; }

      /* Tablet */
      @media (max-width: 1024px) {
        .pt-affiliate-hotspot-cta { top: 79%; left: 11%; width: 38%; height: 10%; }
        .pt-affiliate-hotspot-secondary { top: 79%; left: 51%; width: 36%; height: 10%; }
        
        /* Part 2 Tablet */
        .part-2 .pt-affiliate-hotspot-cta { top: 79.6%; left: 9.8%; width: 37.9%; height: 10%; }
        .part-2 .pt-affiliate-hotspot-secondary { top: 80.4%; left: 51%; width: 36.4%; height: 8.5%; }
      }

      /* Mobile */
      @media (max-width: 767px) {
        .pt-affiliate-hotspot-cta { top: 79.3%; left: 9%; width: 82%; height: 6.6%; }
        .pt-affiliate-hotspot-secondary { top: 87%; left: 9%; width: 82%; height: 5.7%; }
        
        /* Part 2 Mobile */
        .part-2 .pt-affiliate-hotspot-cta { top: 77.6%; left: 8.6%; width: 83%; height: 6.1%; }
        .part-2 .pt-affiliate-hotspot-secondary { top: 85.2%; left: 8.6%; width: 83%; height: 5.7%; }
      }
`;

html = html.replace(oldCSS, newCSS);

const oldHTML = `
    <!-- Affiliate Ad Modal (Portuguese) -->
    <div id="ptAffiliateModal" class="glass-modal pt-affiliate-modal">
      <div class="pt-affiliate-content">
        <picture>
          <source media="(max-width: 767px)" id="ptAffiliateSrcMobile" srcset="" />
          <source media="(max-width: 1024px)" id="ptAffiliateSrcTablet" srcset="" />
          <img id="ptAffiliateSrcDesktop" src="" alt="Anúncio Parceiro" />
        </picture>
        <div id="ptAffiliateClose" class="pt-affiliate-close" onclick="closePtAffiliateModal()"></div>
        <a id="ptAffiliateLink" class="pt-affiliate-link" href="https://chk.eduzz.com/G96177JAW1?a=85153592" target="_blank" rel="noopener noreferrer sponsored" data-google-vignette="false" onclick="closePtAffiliateModal()"></a>
      </div>
    </div>
`;

const newHTML = `
    <!-- Affiliate Ad Modal (Portuguese) -->
    <div id="ptAffiliateModal" class="glass-modal pt-affiliate-modal">
      <div class="pt-affiliate-content">
        <picture>
          <source media="(max-width: 767px)" id="ptAffiliateSrcMobile" srcset="" />
          <source media="(max-width: 1024px)" id="ptAffiliateSrcTablet" srcset="" />
          <img id="ptAffiliateSrcDesktop" src="" alt="Anúncio Parceiro" />
        </picture>
        <a id="ptAffiliateHotspotCta" class="pt-affiliate-hotspot pt-affiliate-hotspot-cta" href="https://chk.eduzz.com/G96177JAW1?a=85153592" target="_blank" rel="noopener noreferrer sponsored" data-google-vignette="false" onclick="window.handleAffiliateCta(event)"></a>
        <div id="ptAffiliateHotspotSecondary" class="pt-affiliate-hotspot pt-affiliate-hotspot-secondary" onclick="window.handleAffiliateSecondary(event)"></div>
        <div id="ptAffiliateHotspotClose" class="pt-affiliate-hotspot pt-affiliate-hotspot-close" onclick="window.handleAffiliateClose(event)"></div>
      </div>
    </div>
`;

html = html.replace(oldHTML, newHTML);

const jsFunctions = `
      window.handleAffiliateCta = function(e) {
        e.stopPropagation();
      };
      
      window.handleAffiliateSecondary = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.closePtAffiliateModal();
      };
      
      window.handleAffiliateClose = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.closePtAffiliateModal();
      };
`;

html = html.replace('window.closePtAffiliateModal = function() {', jsFunctions + '\n      window.closePtAffiliateModal = function() {');

// We need to add the part-1 or part-2 class to ptAdModal in tentarAbrirAnuncioPortugues
html = html.replace('ptAdModal.classList.add("active");', 'ptAdModal.className = "glass-modal pt-affiliate-modal active part-" + parte;');

fs.writeFileSync("index.html", html);
console.log("Replaced CSS, HTML and JS");

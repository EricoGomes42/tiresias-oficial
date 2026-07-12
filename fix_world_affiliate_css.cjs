const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldCSSBlock = `    /* WORLD CSS POSITIONS TO BE FILLED LATER */`;
const newCSSBlock = `
      .world-affiliate-hotspot-close { top: 0; right: 0; width: 10%; height: 10%; }

      /* Desktop Defaults */
      .world-affiliate-hotspot-cta { top: 83%; left: 13%; width: 36%; height: 8%; }
      .world-affiliate-hotspot-secondary { top: 83%; left: 51.5%; width: 32.5%; height: 8%; }
      
      /* Part 2 Desktop */
      .part-2 .world-affiliate-hotspot-cta { top: 79%; left: 7.5%; width: 31.5%; height: 10.5%; }
      .part-2 .world-affiliate-hotspot-secondary { top: 79%; left: 41%; width: 29%; height: 10.5%; }

      /* Tablet */
      @media (max-width: 1024px) {
        .world-affiliate-hotspot-cta { top: 79%; left: 11%; width: 38%; height: 10%; }
        .world-affiliate-hotspot-secondary { top: 79%; left: 51%; width: 36%; height: 10%; }
        
        /* Part 2 Tablet */
        .part-2 .world-affiliate-hotspot-cta { top: 79.6%; left: 9.8%; width: 37.9%; height: 10%; }
        .part-2 .world-affiliate-hotspot-secondary { top: 80.4%; left: 51%; width: 36.4%; height: 8.5%; }
      }

      /* Mobile */
      @media (max-width: 767px) {
        .world-affiliate-hotspot-cta { top: 79.3%; left: 9%; width: 82%; height: 6.6%; }
        .world-affiliate-hotspot-secondary { top: 87%; left: 9%; width: 82%; height: 5.7%; }
        
        /* Part 2 Mobile */
        .part-2 .world-affiliate-hotspot-cta { top: 77.6%; left: 8.6%; width: 83%; height: 6.1%; }
        .part-2 .world-affiliate-hotspot-secondary { top: 85.2%; left: 8.6%; width: 83%; height: 5.7%; }
      }
`;

html = html.replace(oldCSSBlock, newCSSBlock);
fs.writeFileSync("index.html", html);
console.log("Injected World Affiliate CSS.");

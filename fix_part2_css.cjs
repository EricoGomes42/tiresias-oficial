const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const oldCSS = `      /* Part 2 Desktop */
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
      }`;

const newCSS = `      /* Part 2 Desktop */
      .part-2 .world-affiliate-hotspot-cta { top: 81%; left: 12.4%; width: 44.8%; height: 10.4%; }
      .part-2 .world-affiliate-hotspot-secondary { top: 81%; left: 58.7%; width: 28.2%; height: 10.4%; }

      /* Tablet */
      @media (max-width: 1024px) {
        .world-affiliate-hotspot-cta { top: 79%; left: 11%; width: 38%; height: 10%; }
        .world-affiliate-hotspot-secondary { top: 79%; left: 51%; width: 36%; height: 10%; }
        
        /* Part 2 Tablet */
        .part-2 .world-affiliate-hotspot-cta { top: 83.2%; left: 9.9%; width: 48.2%; height: 9.9%; }
        .part-2 .world-affiliate-hotspot-secondary { top: 83.2%; left: 59.8%; width: 29.1%; height: 9.9%; }
      }

      /* Mobile */
      @media (max-width: 767px) {
        .world-affiliate-hotspot-cta { top: 79.3%; left: 9%; width: 82%; height: 6.6%; }
        .world-affiliate-hotspot-secondary { top: 87%; left: 9%; width: 82%; height: 5.7%; }
        
        /* Part 2 Mobile */
        .part-2 .world-affiliate-hotspot-cta { top: 80.4%; left: 13.4%; width: 73.2%; height: 7.4%; }
        .part-2 .world-affiliate-hotspot-secondary { top: 88.6%; left: 13.4%; width: 73.2%; height: 7.4%; }
      }`;

html = html.replace(oldCSS, newCSS);
fs.writeFileSync("index.html", html);
console.log("Fixed part 2 CSS.");

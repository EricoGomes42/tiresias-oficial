const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

// The user states that the CTA button in Part 2 is not opening clickbank, probably because the secondary button hotspot covers it.
// And the CONTINUE RITUAL hotspot is not covering the right edge of the button.
// I will wait for the exact percentages from the vision model.

const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

html = html.replace(`      window.handleWorldAffiliateSecondary = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();`, `      window.handleWorldAffiliateSecondary = function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();`);

fs.writeFileSync("index.html", html);
console.log("Renamed e to event");

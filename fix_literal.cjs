const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");
html = html.replace("<script>\\n      window.formatLimitMessage", "<script>\n      window.formatLimitMessage");
fs.writeFileSync("index.html", html);
console.log("Fixed literal newline");

const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");
html = html.replace("/* background: rgba(0,255,0,0.15); outline: 2px solid green; */", "background:rgba(255,0,0,.15); outline:2px solid red;");
fs.writeFileSync("index.html", html);
console.log("Added debug css");

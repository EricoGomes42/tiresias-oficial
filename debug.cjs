const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const regex = /let i18n = (\{[\s\S]*?\n\s{6}\});\n/m;
const match = html.match(regex);
console.log(match ? "Matched length: " + match[0].length : "No match");
if (match) {
  try {
     let x = new Function('return ' + match[1])();
     console.log("Success parsing i18n snippet");
  } catch(e) {
     console.error("Syntax error in i18n snippet:");
     console.error(e.message);
     fs.writeFileSync("debug-i18n.txt", match[1]);
  }
}

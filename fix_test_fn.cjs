const fs = require("fs");
let html = fs.readFileSync("index.html", "utf-8");

const testFn = `
      window.testWorldAffiliate = function (part) {
        sessionStorage.removeItem("tiresias_world_affiliate_part1_shown");
        sessionStorage.removeItem("tiresias_world_affiliate_part2_shown");
        window.tentarAbrirAnuncioInternacional(part);
      };
`;

if (!html.includes('testWorldAffiliate')) {
  html = html.replace('window.tentarAbrirAnuncioInternacional = function(parte) {', testFn + '\n      window.tentarAbrirAnuncioInternacional = function(parte) {');
  fs.writeFileSync("index.html", html);
  console.log("Added test fn");
}

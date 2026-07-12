const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const scriptMatch = html.match(/<script>(.*?)<\/script>/gs);
if (scriptMatch) {
  scriptMatch.forEach((s, i) => fs.writeFileSync('script_' + i + '.js', s.replace(/<\/?script>/g, '')));
}

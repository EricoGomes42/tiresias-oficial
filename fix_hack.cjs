const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Remove the hack
content = content.replace(
  /\/\/ Mobile text mapping for proxies we added earlier[\s\S]*?if\s*\(mob\s*&&\s*DOM\.inst\)\s*\{\s*\/\/\s*Keep proxy functional\s*mobInstr\.innerHTML\s*=\s*mob\.innerHTML;\s*\}\s*\}/,
  ""
);

fs.writeFileSync('index.html', content, 'utf8');

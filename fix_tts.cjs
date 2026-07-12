const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf-8');
indexHtml = indexHtml.replace(/const speechMsg = data\.message\.replace\(\/\(\[\.\?!…\]\+\)\/g, "\$1 \.\.\. "\)\.replace\(\/\\n\/g, " \.\.\. "\);/g, 'const speechMsg = data.message;');
indexHtml = indexHtml.replace(/const speechMsg = msg\.replace\(\/\(\[\.\?!…\]\+\)\/g, "\$1 \.\.\. "\)\.replace\(\/\\n\/g, " \.\.\. "\);/g, 'const speechMsg = msg;');
fs.writeFileSync('index.html', indexHtml, 'utf-8');

let serverTs = fs.readFileSync('server.ts', 'utf-8');
serverTs = serverTs.replace(/const modifiedText = text\.trim\(\) \+ " \.\.\. ";/g, 'const modifiedText = text.trim();');
fs.writeFileSync('server.ts', serverTs, 'utf-8');

console.log("Replaced TTS spacing.");

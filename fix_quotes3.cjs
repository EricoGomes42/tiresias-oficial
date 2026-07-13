const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The sed command above probably broke the outer prompt definition since I did `sed -i 's/\`/"/g'` which replaced literal \` with ". Oh wait, I escaped the backtick as \\\` in the sed command.

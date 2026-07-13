const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /\$\{theme \? `The user recently reflected on: "\$\{theme\}". Keep your message in the same philosophical and emotional field without contradicting this context.` : `This is the first message for this user today.`\}/g,
  '${theme ? `The user recently reflected on: "${theme}". Keep your message in the same philosophical and emotional field without contradicting this context.` : `This is the first message for this user today.`}'
);
// I can just replace the backticks with double quotes around the strings in the template.
// Actually, sed might be easier.

const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The sed command above probably broke the outer prompt definition since I did `sed -i 's/\`/"/g'` which replaced literal \` with ". Oh wait, I escaped the backtick as \\\` in the sed command.

// Let's just fix the specific line.
const targetLineOld = 'CRITICAL RULES:\n- IMPORTANT: You MUST write the final message ONLY in ${langName} (language code: ${language}). Do not write in English unless the selected language is English. Do not mix languages. The text MUST sound like it was originally written by an excellent native speaker. Never translate literally.\n- PREVIOUS CONTEXT: ${theme ? "The user recently reflected on: "${theme}". Keep your message in the same philosophical and emotional field without contradicting this context." : "This is the first message for this user today."}';

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('PREVIOUS CONTEXT: ${theme ?')) {
    lines[i] = '- PREVIOUS CONTEXT: ${theme ? `The user recently reflected on: "${theme}". Keep your message in the same philosophical and emotional field without contradicting this context.` : `This is the first message for this user today.`}';
  }
}

fs.writeFileSync('server.ts', lines.join('\n'), 'utf8');

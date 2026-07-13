const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const targetStr = `          if (!language.startsWith("en")) {
            const lowerText = responseText.toLowerCase();
            const englishLeak = lowerText.match(
              /\\b(the|and|is|are|will|come back later|take care)\\b/,
            );
            if (englishLeak) {
              continue; // retry
            }
          }
          valid = true;`;

const newStr = `          if (!language.startsWith("en")) {
            const lowerText = responseText.toLowerCase();
            const englishLeak = lowerText.match(
              /\\b(the|and|is|are|will|come back later|take care)\\b/,
            );
            if (englishLeak) {
              console.log("Validation failed: English leak detected");
              continue; // retry
            }
          }

          // Strict Structural & Quality Validation
          const trimmedText = responseText.trim();
          
          // 1. Must end with proper punctuation
          if (!/[.!?]$/.test(trimmedText)) {
            console.log("Validation failed: Does not end with proper punctuation");
            continue; // retry
          }

          // 2. Must not contain prohibited structural repetitions (check first few words)
          const lowerTrimmed = trimmedText.toLowerCase();
          const bannedOpenings = [
            "às vezes", "as vezes", "talvez", "há momentos em que", "nem sempre",
            "existem dias em que", "você não precisa", "é normal", "quando", "mesmo quando",
            "em alguns momentos", "sometimes", "maybe", "there are moments", "not always",
            "a veces", "tal vez", "hay momentos en que"
          ];
          
          const startsWithBanned = bannedOpenings.some(phrase => lowerTrimmed.startsWith(phrase));
          if (startsWithBanned) {
            console.log("Validation failed: Banned opening detected");
            continue; // retry
          }

          // 3. Must not have obvious cut-offs or hanging conjunctions at the end
          const words = trimmedText.split(/\\s+/);
          const lastWord = words[words.length - 1].replace(/[^a-zA-ZáéíóúãõçÁÉÍÓÚÃÕÇ]/g, "").toLowerCase();
          const hangingWords = ["de", "para", "com", "e", "ou", "mas", "que", "se", "a", "o", "as", "os", "um", "uma", "in", "of", "to", "and", "or", "but"];
          if (hangingWords.includes(lastWord)) {
             console.log("Validation failed: Hanging word at the end");
             continue; // retry
          }

          valid = true;`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('server.ts', content, 'utf8');
  console.log("Validation logic successfully updated.");
} else {
  console.log("Could not find target string to replace.");
}

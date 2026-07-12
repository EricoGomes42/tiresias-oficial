const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace(/DOM\.txt\.innerText = message;/g, 'DOM.txt.innerHTML = window.formatWisdomMessage(message);');

// There is also:
/*
DOM.txt.innerText =
  t.limitMsg ||
  "The message was lost in silence. Try again later.";
*/
// Let's replace it with innerHTML

html = html.replace(/DOM\.txt\.innerText =\s*t\.limitMsg \|\|\s*"The message was lost in silence\. Try again later\.";/g, 
  'DOM.txt.innerHTML = window.formatWisdomMessage(t.limitMsg || "The message was lost in silence. Try again later.");');

fs.writeFileSync('index.html', html);
console.log("Replaced innerText with innerHTML");

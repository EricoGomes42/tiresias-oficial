const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Find `let ritualCountForSession = 0;` and move it right after `let flowState = 0; // 0=Init...`
content = content.replace(/[ \t]*let ritualCountForSession = 0;\n/g, "");

content = content.replace(
  /let flowState = 0; \/\/ 0=Init, 1=Sintonizando, 2=Ready, 3=Done/g,
  `let flowState = 0; // 0=Init, 1=Sintonizando, 2=Ready, 3=Done\n      let ritualCountForSession = parseInt(sessionStorage.getItem("tiresiasCycles") || "0", 10);\n\n      function getBtnStartText() {\n        if (ritualCountForSession === 0) return t.btnStart;\n        if (ritualCountForSession === 1) return t.btnStart2 || t.btnStart;\n        return t.btnStart3 || t.btnStart;\n      }`
);

// We should also replace the `ritualCountForSession++;` with saving it.
content = content.replace(
  /ritualCountForSession\+\+;\s*sessionStorage\.removeItem\("tiresiasTrance"\);/g,
  `ritualCountForSession++;\n        sessionStorage.setItem("tiresiasCycles", ritualCountForSession.toString());\n        sessionStorage.removeItem("tiresiasTrance");`
);


// 2. Replace DOM.btn.innerText = t.btnStart; with DOM.btn.innerText = getBtnStartText();
content = content.replace(/DOM\.btn\.innerText = t\.btnStart;/g, `DOM.btn.innerText = getBtnStartText();`);

// 3. One special case in applyTranslations(): `mobBtnTxt.innerText = t.btnStart;`
content = content.replace(/mobBtnTxt\.innerText = t\.btnStart;/g, `mobBtnTxt.innerText = getBtnStartText();`);

// 4. Update the initialization logic where the session was loaded before (which we deleted previously). Wait, we did this in step 1.

// 5. In applyTranslations, update `if(mobBtnTxt && t.btnStart)`
content = content.replace(/if\(mobBtnTxt && t\.btnStart\)/g, `if(mobBtnTxt && t.btnStart)`);

fs.writeFileSync('index.html', content, 'utf8');
console.log("Button text modifications applied");

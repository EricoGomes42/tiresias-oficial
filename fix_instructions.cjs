const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf-8');

let newContent = content.replace(/<span class="desktop-only-text">(.*?)<\/span>/g, (match, inner) => {
  // inner is e.g. "Take a deep breath. Enter silence.<br>Reflect on your moment. The oracle has something to reveal..."
  
  let parts = inner.split('<br>');
  let line1 = parts[0].trim();
  let rest = parts[1].trim();
  
  // Find the first sentence ending in rest
  // Look for first '. ' or '。'
  let splitIndex = -1;
  let dotIndex = rest.indexOf('. ');
  let jpDotIndex = rest.indexOf('。');
  
  if (dotIndex !== -1) {
    splitIndex = dotIndex + 1; // include the dot
  } else if (jpDotIndex !== -1) {
    splitIndex = jpDotIndex + 1; // include the dot
  } else {
    // maybe no space after dot?
    let justDot = rest.indexOf('.');
    if (justDot !== -1) splitIndex = justDot + 1;
  }
  
  let line2 = rest;
  let line3 = "";
  if (splitIndex !== -1) {
    line2 = rest.substring(0, splitIndex).trim();
    line3 = rest.substring(splitIndex).trim();
  }
  
  return `<span class="desktop-only-text"><span class="instruction-line instruction-line-1">${line1}</span><span class="instruction-line instruction-line-2">${line2}</span><span class="instruction-line instruction-line-3">${line3}</span></span>`;
});

fs.writeFileSync('index.html', newContent, 'utf-8');
console.log("Updated instructions.");

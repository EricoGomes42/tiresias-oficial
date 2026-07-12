const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyze(file) {
  try {
    const data = fs.readFileSync(file).toString("base64");
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ role: 'user', parts: [{ inlineData: { data, mimeType: 'image/webp' } }, { text: "For this ad banner image, I need to overlay clickable transparent boxes on three buttons: 'SHOW ME MY SOULMATE', 'CONTINUE RITUAL' (or equivalent final step button), and the close 'X' button. Give me the CSS 'top', 'left', 'width', and 'height' percentages for each, carefully considering if they are stacked vertically or side-by-side. Return ONLY a JSON block like: { 'cta': { top, left, width, height }, 'secondary': { top, left, width, height }, 'close': { top, left, width, height } } and absolutely no other text." }] }]
    });
    console.log("---", file, "---");
    console.log(response.text);
  } catch(e) {
    console.error(e);
  }
}

async function run() {
  await analyze('public/anuncios-ingles-mundo/Parte 01/ads-tara-luna-part1-desktop.webp');
  await analyze('public/anuncios-ingles-mundo/Parte 01/ads-tara-luna-part1-tablet.webp');
  await analyze('public/anuncios-ingles-mundo/Parte 01/ads-tara-luna-part1-mobile.webp');
  await analyze('public/anuncios-ingles-mundo/Parte 02/ads-tara-luna-part2-desktop.webp');
  await analyze('public/anuncios-ingles-mundo/Parte 02/ads-tara-luna-part2-tablet.webp');
  await analyze('public/anuncios-ingles-mundo/Parte 02/ads-tara-luna-part2-mobile.webp');
}
run();

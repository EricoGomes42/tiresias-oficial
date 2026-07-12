import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyze(part, type, file) {
  try {
    const data = fs.readFileSync(file).toString("base64");
    const prompt = `This is an ad banner. Look at it very carefully.
I need to position transparent clickable <div> elements over three specific buttons:
1. The CTA button that says "QUERO CONHECER".
2. The secondary button that says "CONTINUAR RITUAL" or "FECHAR E CONCLUIR RITUAL".
3. The "X" close button (usually in the top right).

For each of these 3 buttons, provide the exact CSS percentages for top, left, width, and height. 
Be highly accurate. 
Reply ONLY with JSON format:
{
  "cta": { "top": "...", "left": "...", "width": "...", "height": "..." },
  "secondary": { "top": "...", "left": "...", "width": "...", "height": "..." },
  "close": { "top": "...", "left": "...", "width": "...", "height": "..." }
}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ role: 'user', parts: [{ inlineData: { data, mimeType: 'image/webp' } }, { text: prompt }] }]
    });
    console.log(`--- Part ${part} ${type} ---`);
    console.log(response.text);
  } catch(e) {
    console.error(e);
  }
}

async function main() {
  await analyze(1, 'desktop', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-desktop.webp');
  await analyze(1, 'tablet', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-tablet.webp');
  await analyze(1, 'mobile', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-mobile.webp');
  await analyze(2, 'desktop', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-desktop.webp');
  await analyze(2, 'tablet', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-tablet.webp');
  await analyze(2, 'mobile', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-mobile.webp');
}
main();

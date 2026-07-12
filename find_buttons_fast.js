import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyze(part, type, file) {
  try {
    const data = fs.readFileSync(file).toString("base64");
    const prompt = `Analyze this image (ad banner, Part ${part} on ${type}). 
I need bounding boxes as percentages [top, left, width, height] (0-100).
Reply ONLY in JSON:
{
  "cta": [top, left, width, height],
  "action": [top, left, width, height],
  "close": [top, left, width, height]
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

Promise.all([
  analyze(1, 'desktop', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-desktop.webp'),
  analyze(1, 'tablet', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-tablet.webp'),
  analyze(1, 'mobile', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-mobile.webp'),
  analyze(2, 'desktop', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-desktop.webp'),
  analyze(2, 'tablet', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-tablet.webp'),
  analyze(2, 'mobile', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-mobile.webp')
]);

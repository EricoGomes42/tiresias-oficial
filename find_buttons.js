import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyze(part, type, file) {
  const data = fs.readFileSync(file).toString("base64");
  const prompt = `Analyze this image (which is an ad banner, Part ${part} on ${type}). 
I need the bounding boxes for the following clickable areas as percentages [top, left, width, height] (from 0 to 100).
Please reply ONLY in JSON format like this:
{
  "cta": [top, left, width, height], // "QUERO CONHECER" button
  "action": [top, left, width, height], // "CONTINUAR RITUAL" (Part 1) or "FECHAR E CONCLUIR RITUAL" (Part 2) button
  "close": [top, left, width, height] // The "X" button (usually top right corner)
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data,
              mimeType: 'image/webp'
            }
          },
          { text: prompt }
        ]
      }
    ]
  });

  console.log(`--- Part ${part} ${type} ---`);
  console.log(response.text);
}

async function main() {
  try {
    await analyze(1, 'desktop', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-desktop.webp');
    await analyze(1, 'tablet', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-tablet.webp');
    await analyze(1, 'mobile', 'public/anuncios-portugues/Parte 01/ads-cansada-parte1-mobile.webp');
    await analyze(2, 'desktop', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-desktop.webp');
    await analyze(2, 'tablet', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-tablet.webp');
    await analyze(2, 'mobile', 'public/anuncios-portugues/Parte 02/ads-cansada-parte2-mobile.webp');
  } catch(e) {
    console.error(e);
  }
}

main();

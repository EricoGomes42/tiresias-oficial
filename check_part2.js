import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyze(file) {
  try {
    const data = fs.readFileSync(file).toString("base64");
    const prompt = `This is an ad banner. I need to overlay clickable boxes on two buttons:
1. The CTA button ("SHOW ME MY SOULMATE").
2. The secondary button ("CONTINUE RITUAL").

Please provide the EXACT CSS percentages (top, left, width, height) to tightly bound EACH button.
Format your response as strict JSON with this exact structure:
{
  "cta": { "top": "XX%", "left": "XX%", "width": "XX%", "height": "XX%" },
  "secondary": { "top": "XX%", "left": "XX%", "width": "XX%", "height": "XX%" }
}
Do not return any other text.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ role: 'user', parts: [{ inlineData: { data, mimeType: 'image/webp' } }, { text: prompt }] }]
    });
    console.log(`--- ${file} ---`);
    console.log(response.text);
  } catch(e) {
    console.error(e);
  }
}

async function main() {
  await analyze('public/anuncios-ingles-mundo/Parte 02/ads-tara-luna-part2-desktop.webp');
  await analyze('public/anuncios-ingles-mundo/Parte 02/ads-tara-luna-part2-tablet.webp');
  await analyze('public/anuncios-ingles-mundo/Parte 02/ads-tara-luna-part2-mobile.webp');
}
main();

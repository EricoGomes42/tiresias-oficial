import { GoogleGenAI } from "@google/genai";
import fs from "fs";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const data = fs.readFileSync('public/anuncios-portugues/Parte 01/ads-cansada-parte1-desktop.webp').toString("base64");
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: [{ role: 'user', parts: [{ inlineData: { data, mimeType: 'image/webp' } }, { text: "Explain the visual layout of this ad, specifically the text and buttons at the bottom. I need to know where the 'QUERO CONHECER' button and 'CONTINUAR RITUAL' buttons are roughly." }] }]
  });
  console.log(response.text);
}
run();

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function analyze(file) {
  const data = fs.readFileSync(file).toString("base64");
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: [{ role: 'user', parts: [{ inlineData: { data, mimeType: 'image/webp' } }, { text: "For this ad, where are the 'QUERO CONHECER' button and the secondary button ('CONTINUAR RITUAL' or 'FECHAR E CONCLUIR RITUAL') located? Are they side-by-side or stacked top-to-bottom? What are their approximate percentages for top, left, width, height? Also the 'X' button location." }] }]
  });
  console.log("---", file, "---");
  console.log(response.text);
}
async function run() {
  await analyze('public/anuncios-portugues/Parte 01/ads-cansada-parte1-desktop.webp');
  await analyze('public/anuncios-portugues/Parte 01/ads-cansada-parte1-tablet.webp');
  await analyze('public/anuncios-portugues/Parte 01/ads-cansada-parte1-mobile.webp');
  await analyze('public/anuncios-portugues/Parte 02/ads-cansada-parte2-desktop.webp');
  await analyze('public/anuncios-portugues/Parte 02/ads-cansada-parte2-mobile.webp');
}
run();

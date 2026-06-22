import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not set. API calls will fail.");
    }
    aiClient = new GoogleGenAI({ 
      apiKey: key || "dummy-key-to-prevent-crash",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  console.log("Gemini configured:", Boolean(process.env.GEMINI_API_KEY));
  console.log("Speechify configured:", Boolean(process.env.SPEECHIFY_API_KEY));
  console.log("Speechify voice:", process.env.SPEECHIFY_VOICE_ID || "missing");
  console.log("Speechify model:", process.env.SPEECHIFY_MODEL || "missing");

  app.use(express.json());

  // Set up rate limiting: max 10 requests per minute per IP for the API endpoints
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15,
    message: { error: "Too many requests from this IP, please try again later." }
  });

  app.use("/api/", apiLimiter);

  app.get("/api/health", (req, res) => {
    res.json({
      ok: true,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      speechifyConfigured: Boolean(process.env.SPEECHIFY_API_KEY),
      speechifyVoiceId: process.env.SPEECHIFY_VOICE_ID || null,
      speechifyModel: process.env.SPEECHIFY_MODEL || null,
      nodeEnv: process.env.NODE_ENV || "development",
      port: process.env.PORT ? "set" : "missing"
    });
  });

  const langMap: Record<string, string> = {
    en: "English",
    es: "Spanish",
    pt: "Brazilian Portuguese",
    fr: "French",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Simplified Chinese",
    hi: "Hindi",
    ar: "Arabic",
    ru: "Russian",
    tr: "Turkish",
    nl: "Dutch",
    pl: "Polish",
    uk: "Ukrainian",
    id: "Indonesian",
    el: "Modern Greek",
    he: "Hebrew",
    ro: "Romanian"
  };

  // API Route to generate oracle content
  app.post("/api/oracle", async (req, res) => {
    const language = req.body?.language || "en";
    const theme = req.body?.theme || "";
    const langName = langMap[language] || "English";
    
    // Fallback strings - no generic endings
    const fallbacks: Record<string, string> = {
      en: "Rest your mind for a moment. Not everything needs an answer today.\n\nTake a slow breath. Some paths clear only when we stop pushing forward.\n\nA small step is enough. Give yourself time to find peace.",
      pt: "Tranquilize seu pensamento por um instante. Nem tudo exige uma resposta hoje.\n\nRespire devagar. Certos caminhos só se revelam quando paramos de avançar à força.\n\nUm pequeno passo já basta. Dê tempo para que sua paz retorne.",
      es: "Descansa tu mente por un momento. No todo necesita una respuesta hoy.\n\nRespira despacio. Algunos caminos solo se aclaran cuando dejamos de empujar.\n\nUn pequeño paso es suficiente. Date tiempo para encontrar la paz.",
      fr: "Reposez votre esprit un instant. Tout ne nécessite pas une réponse aujourd'hui.\n\nRespirez lentement. Certains chemins ne s'éclaircissent que lorsqu'on arrête de forcer.\n\nUn petit pas suffit. Laissez-vous le temps de trouver la paix.",
      de: "Ruhen Sie Ihre Gedanken für einen Moment aus. Nicht alles braucht heute eine Antwort.\n\nAtmen Sie langsam. Manche Wege werden erst klar, wenn wir nicht mehr drängen.\n\nEin kleiner Schritt ist genug. Geben Sie sich Zeit, Frieden zu finden.",
      it: "Riposa la mente per un istante. Non tutto ha bisogno di una risposta oggi.\n\nFai un bel respiro lento. Alcuni sentieri si chiariscono solo quando smettiamo di forzare.\n\nUn piccolo passo è sufficiente. Concediti del tempo per trovare la pace."
    };

    try {
      const prompt = `You are Tiresias, an old, kind, calm, welcoming, patient, wise, and simple grandfatherly figure.
Your goal is to provide a short, contemplative message for someone looking for a moment of pause.

CRITICAL RULES:
- IMPORTANT: You MUST write the final message ONLY in ${langName} (language code: ${language}). Do not write in English unless the selected language is English. Do not include any translations into English. Do not mix languages. Do not end with English phrases.
- PREVIOUS CONTEXT: ${theme ? `The user recently reflected on: "${theme}". Keep your message in the same philosophical and emotional field without contradicting this context.` : `This is the first message for this user today.`}
- Generate ONLY the message text. No prefixes, no titles, no explanations.
- Speak directly and exclusively in ${langName}.
- Do NOT predict the future, do NOT talk about destiny, magic, religion, or miracles. No clinical advice.
- NEVER use CAPS LOCK for emphasis.
- COHERENCE: Sound like the same person on different days. Focus ONLY on: rest, fresh starts, patience, acceptance, hope, and small steps. Avoid generic endings like "Take care", "Come back later", or "Good luck".
- SIMPLICITY: You write to be understood by everyone, from a farmer to a scholar. Always choose simple, accessible words over beautiful or complex ones. 
- LENGTH & STRUCTURE: The message MUST contain exactly 5 to 7 short sentences in total. You MUST format the response into 2 or 3 short paragraph blocks, separated by a blank line (\\n\\n). Each paragraph block MUST contain 1 to 3 short sentences. 
- Deep but simple: The message should touch the person's heart, have emotional depth, and feel like genuine human advice. It must be simple without being superficial, and generate deep identification.
- No emojis.`;

      const ai = getAIClient();
      
      let responseText = "";
      let attempts = 0;
      let valid = false;

      while (attempts < 3 && !valid) {
          attempts++;
          try {
              const modelName = attempts === 2 ? "gemini-2.5-flash" : "gemini-2.5-flash-lite";
              const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    systemInstruction: "You are Tiresias, a wise, calm, gentle, and comforting figure.",
                    temperature: 0.7,
                }
              });
              
              responseText = response.text || "";
              
              // Language Validation (very basic check for unwanted English phrases if lang is not english)
              if (!language.startsWith("en")) {
                  const lowerText = responseText.toLowerCase();
                  const englishLeak = lowerText.match(/\\b(the|and|is|are|will|come back later|take care)\\b/);
                  if (englishLeak) {
                      continue; // retry
                  }
              }
              valid = true;
          } catch (e: any) {
              if (attempts < 3) {
                  // sleep 1 second and retry
                  await new Promise(r => setTimeout(r, 1000));
                  continue;
              }
              throw e;
          }
      }
      
      if (!valid) {
          throw new Error("Failed to generate language-safe message");
      }

      res.json({ message: responseText });
    } catch (error: any) {
      console.error("API call error:", error.message);
      const fallback = fallbacks[language as string] || fallbacks['en'];
      res.json({ message: fallback });
    }
  });

  // API Route for Speechify text-to-speech prep
  app.post("/api/speech", async (req, res) => {
    const { text, lang } = req.body;
    
    const apiKey = process.env.SPEECHIFY_API_KEY;
    if (!apiKey) {
      return res.status(501).json({ error: "Speechify not configured. Falling back to browser Synthesis." });
    }

    try {
      let finalVoiceId = process.env.SPEECHIFY_VOICE_ID || "declan";

      // Add a breath/pause at the end of the text for a softer ending
      const modifiedText = text.trim() + " ... ";

      const payload: any = {
        input: modifiedText,
        voice_id: finalVoiceId,
        model: process.env.SPEECHIFY_MODEL || "simba-multilingual",
        audio_format: "mp3"
      };

      const response = await fetch("https://api.speechify.ai/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(`API returned ${response.status}: ${errData}`);
      }

      const data = await response.json();
      res.json({ audioBase64: data.audio_data });
    } catch (error: any) {
      console.error("Speechify Error:", error);
      res.status(500).json({ error: "Failed to generate speech audio.", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

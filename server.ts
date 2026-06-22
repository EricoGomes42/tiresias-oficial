import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { SpeechifyClient } from "@speechify/api";

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

  // Trust the first proxy to avoid X-Forwarded-For issues with rate limiter in Cloud Run
  app.set("trust proxy", 1);

  app.use(express.json());

  // Set up rate limiting: max 10 requests per minute per IP for the API endpoints
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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
    
    console.log("--- BACKEND: /api/oracle ---");
    console.log("lang recebido:", language);
    console.log("languageName usado:", langName);
    console.log("GEMINI_API_KEY existe?", Boolean(process.env.GEMINI_API_KEY));
    
    // Fallback strings - no generic endings
    const fallbacks: Record<string, string> = {
      en: "Rest your mind for a moment. Not everything needs an answer today.\n\nTake a slow breath. Some paths clear only when we stop pushing forward.\n\nA small step is enough. Give yourself time to find peace.",
      pt: "Tranquilize seu pensamento por um instante. Nem tudo exige uma resposta hoje.\n\nRespire devagar. Certos caminhos só se revelam quando paramos de avançar à força.\n\nUm pequeno passo já basta. Dê tempo para que sua paz retorne.",
      es: "Descansa tu mente por un momento. No todo necesita una respuesta hoy.\n\nRespira despacio. Algunos caminos solo se aclaran cuando dejamos de empujar.\n\nUn pequeño paso es suficiente. Date tiempo para encontrar la paz.",
      fr: "Reposez votre esprit un instant. Tout ne nécessite pas une réponse aujourd'hui.\n\nRespirez lentement. Certains chemins ne s'éclaircissent que lorsqu'on arrête de forcer.\n\nUn petit pas suffit. Laissez-vous le temps de trouver la paix.",
      de: "Ruhen Sie Ihre Gedanken für einen Moment aus. Nicht alles braucht heute eine Antwort.\n\nAtmen Sie langsam. Manche Wege werden erst klar, wenn wir nicht mehr drängen.\n\nEin kleiner Schritt ist genug. Geben Sie sich Zeit, Frieden zu finden.",
      it: "Riposa la mente per un istante. Non tutto ha bisogno di una risposta oggi.\n\nFai un bel respiro lento. Alcuni sentieri si chiariscono solo quando smettiamo di forzare.\n\nUn piccolo passo è sufficiente. Concediti del tempo per trovare la pace.",
      ja: "少しの間、心を休ませてください。今日すべてに答えを出す必要はありません。\n\nゆっくりと深呼吸をしましょう。前に進むのをやめた時にだけ、見えてくる道があります。\n\n小さな一歩で十分です。平和を見つけるための時間を自分に与えてください。",
      ko: "잠시 마음을 쉬게 하세요. 모든 것에 오늘 대답할 필요는 없습니다.\n\n천천히 숨을 쉬세요. 억지로 나아가는 것을 멈출 때 비로소 분명해지는 길도 있습니다.\n\n작은 한 걸음이면 충분합니다. 평화를 찾을 시간을 스스로에게 주세요.",
      zh: "让你的心智稍作休息。今天并不是所有事情都需要答案。\n\n深吸一口气。有些道路只有在停止强求时才会清晰。\n\n一小步就足够了。给自己留出寻找平静的时间。",
      hi: "एक पल के लिए अपने मन को विश्राम दें। आज हर चीज़ के उत्तर की आवश्यकता नहीं है।\n\nधीरे-धीरे सांस लें। कुछ मार्ग तभी स्पष्ट होते हैं जब हम जोर देना बंद कर देते हैं。\n\nएक छोटा कदम ही काफी है। शांति पाने के लिए खुद को समय दें।",
      ar: "أرح عقلك للحظة. ليس كل شيء يحتاج إلى إجابة اليوم.\n\nخذ نفساً بطيئاً. بعض المسارات تتضح فقط عندما نتوقف عن الدفع للأمام.\n\nخطوة صغيرة تكفي. امنح نفسك الوقت لتجد السلام.",
      ru: "Дайте своему разуму отдохнуть на мгновение. Не все требует ответа сегодня.\n\nСделайте медленный вдох. Некоторые пути проясняются только тогда, когда мы перестаем идти напролом.\n\nОдного маленького шага достаточно. Дайте себе время обрести покой.",
      tr: "Bir an için zihninizi dinlendirin. Bugün her şeyin bir cevaba ihtiyacı yok.\n\nYavaşça bir nefes alın. Bazı yollar sadece zorlamayı bıraktığımızda netleşir.\n\nKüçük bir adım yeterlidir. Huzur bulmak için kendinize zaman tanıyın.",
      nl: "Laat je gedachten even rusten. Niet alles heeft vandaag een antwoord nodig.\n\nHaal langzaam adem. Sommige paden worden pas helder als we stoppen met forceren.\n\nEen kleine stap is genoeg. Geef jezelf de tijd om rust te vinden.",
      pl: "Pozwól swojemu umysłowi przez chwilę odpocząć. Nie wszystko wymaga dzisiaj odpowiedzi.\n\nWeź powolny oddech. Niektóre ścieżki stają się jasne dopiero, gdy przestajemy pchać na siłę.\n\nMały krok w zupełności wystarczy. Daj sobie czas na odnalezienie spokoju.",
      uk: "Дайте своєму розуму відпочити на мить. Не все потребує відповіді сьогодні.\n\nЗробіть повільний вдих. Деякі шляхи прояснюються лише тоді, коли ми перестаємо йти напролом.\n\nОдного маленького кроку цілком достатньо. Дайте собі час знайти спокій.",
      id: "Istirahatkan pikiranmu sejenak. Tidak semuanya membutuhkan jawaban hari ini.\n\nTarik napas perlahan. Beberapa jalan hanya menjadi jelas ketika kita berhenti memaksakan diri.\n\nSatu langkah kecil saja sudah cukup. Beri dirimu waktu untuk menemukan kedamaian.",
      el: "Ξεκουράστε το μυαλό σας για μια στιγμή. Δεν χρειάζονται όλα μια απάντηση σήμερα.\n\nΠάρτε μια αργή ανάσα. Κάποια μονοπάτια ξεκαθαρίζουν μόνο όταν σταματάμε να πιέζουμε τα πράγματα.\n\nΈνα μικρό βήμα αρκεί. Δώστε στον εαυτό σας χρόνο για να βρει τη γαλήνη.",
      he: "תן למחשבות שלך לנוח לרגע. לא הכל חייב לקבל תשובה היום.\n\nקח נשימה איטית. חלק מהשבילים מתבהרים רק כשאנחנו מפסיקים לדחוף קדימה.\n\nצעד קטן זה מספיק. תן לעצמך זמן למצוא שקט.",
      ro: "Odihnește-ți mintea pentru o clipă. Nu orice lucruri au nevoie de un răspuns astăzi.\n\nRespiră încet. Unele căi devin clare abia atunci când ne oprim din a mai forța lucrurile.\n\nUn pas mic este îndeajuns. Acordă-ți timpul necesar pentru a-ți regăsi liniștea."
    };

    try {
      const prompt = `You are Tiresias, a wise, serene, neutral, and deeply human presence. You are NOT a coach, therapist, religious preacher, or motivational guru.
Your goal is to provide a short message that brings comfort, lucidity, and touches the heart of the reader without trying to impress.

CRITICAL RULES:
- IMPORTANT: You MUST write the final message ONLY in ${langName} (language code: ${language}). Do not write in English unless the selected language is English. Do not include any translations into English. Do not mix languages. Do not end with English phrases.
- PREVIOUS CONTEXT: ${theme ? `The user recently reflected on: "${theme}". Keep your message in the same philosophical and emotional field without contradicting this context.` : `This is the first message for this user today.`}
- Generate ONLY the message text. No prefixes, no titles, no explanations.
- Speak directly and exclusively in ${langName}.
- ADDRESSING THE USER (STRICT): Never address the user with nicknames, affectionate expressions, family relationships, or personal forms of address in any language (e.g., never say "meu amigo", "minha amiga", "meu amor", "meu bem", "meu filho", "minha filha", "alma querida", "querido coração", "querida pessoa", "querido viajante", "my friend", "my dear"). Write as if speaking to humanity, not to a specific person. The tone MUST be inclusive, welcoming, deep, serene, respectful, contemplative, and impersonal.
- THEMES & TOPICS: You can occasionally address conflicts, bad choices, regrets, losses, grief, fear, anxiety, work, failures, changes, hope, courage, discipline, relationships, purpose, happiness, gratitude, and impermanence.
- AVOID REPETITION: Not every response needs to talk about "taking a deep breath", "staying in silence", "slowing down", or "taking one step at a time". Some responses can be more direct, some contemplative, some encouraging, some firm, and some can simply acknowledge pain.
- PROHIBITED TONES & BEHAVIORS: Never be overly pessimistic. Never be overly optimistic. Never make promises. Never say "everything will be alright". Never make predictions. Never use religious language. Never try to convert anyone. Never use coach-like phrases. Do NOT talk about destiny, magic, or miracles. No clinical advice. NEVER use CAPS LOCK.
- SIMPLICITY & ACCESSIBILITY: The message should be understandable to someone with little formal education and equally meaningful to someone with a PhD or postdoctoral background. You write like someone who deeply understands the human condition. Avoid overly technical vocabulary, academic terms, psychological jargon, clinical language, convoluted constructions, or artificial phrases. Prefer simplicity, clarity, humanity, natural depth, easy-to-understand sentences, and universal ideas. The deepest wisdom is usually expressed in the simplest words.
- LENGTH & STRUCTURE: The message MUST contain exactly 5 to 7 short sentences in total. You MUST format the response into 2 or 3 short paragraph blocks, separated by a blank line (\\n\\n). Each paragraph block MUST contain 1 to 3 short sentences.
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

      console.log("Gemini respondeu com sucesso?");
      res.json({ message: responseText });
    } catch (error: any) {
      console.error("API call error:", error.message);
      let fallback = fallbacks['en'];
      if (langMap[language as string]) {
          fallback = fallbacks[language as string] || fallbacks['en'];
      }
      console.log("Fallback acionado (Oracle)");
      res.json({ message: fallback, fallback: true });
    }
  });

  // API Route for Speechify text-to-speech prep
  app.post("/api/speech", async (req, res) => {
    const { text, lang } = req.body;
    
    console.log("speech route called");
    console.log("hasSpeechifyKey", Boolean(process.env.SPEECHIFY_API_KEY));

    const apiKey = process.env.SPEECHIFY_API_KEY;
    if (!apiKey) {
      console.log("se caiu em fallback: sim (Sem chave Speechify)");
      return res.status(501).json({ error: "Speechify not configured. Falling back to browser Synthesis.", fallback: true });
    }

    try {
      let finalVoiceId = process.env.SPEECHIFY_VOICE_ID || "declan";
      
      // If the user specified the display name "declan", map it to its actual API id "ron" 
      // because the Speechify API throws 404 if we pass "declan" as voiceId.
      if (finalVoiceId.toLowerCase() === "declan") {
          finalVoiceId = "ron"; 
      }
      
      console.log("voiceId usado:", finalVoiceId);

      // Add a breath/pause at the end of the text for a softer ending
      const modifiedText = text.trim() + " ... ";

      const client = new SpeechifyClient({
        token: apiKey
      });

      const audioRequest: any = {
        input: modifiedText,
        voiceId: finalVoiceId,
        audioFormat: "mp3"
      };

      if (process.env.SPEECHIFY_MODEL) {
        audioRequest.model = process.env.SPEECHIFY_MODEL;
      }

      const audioResponse = await client.tts.audio.speech(audioRequest);

      if (!audioResponse || !audioResponse.audioData) {
         throw new Error("No audio data returned");
      }

      // If audioData is already base64, returning it directly prevents double encoding.
      // But we will respect the user's requested instruction pattern:
      // Since we know audioData is a base64 string, wrapping it in Buffer.from(..., 'base64') and converting back works.
      const base64Str = Buffer.from(audioResponse.audioData, "base64").toString("base64");
      res.json({ audioBase64: base64Str });
    } catch (error: any) {
      console.error("Speechify API Error:", error.message, error);
      let errorMsg = "Speechify error";
      if (error.statusCode === 401) errorMsg = "chave inválida";
      else if (error.statusCode === 402) errorMsg = "falta de créditos";
      else if (error.statusCode === 429) errorMsg = "rate limit";
      
      console.log("se caiu em fallback: sim", "-", errorMsg);
      res.status(error.statusCode || 500).json({ error: "Failed to generate speech audio.", details: error.message, fallback: true });
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

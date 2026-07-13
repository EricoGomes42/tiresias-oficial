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
          "User-Agent": "aistudio-build",
        },
      },
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
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
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
      port: process.env.PORT ? "set" : "missing",
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
    ro: "Romanian",
  };

  // API Route to generate oracle content
  app.post("/api/oracle", async (req, res) => {
    const language = req.body?.language || "en";
    const theme = req.body?.theme || "";
    const cycle = req.body?.cycle || 1;
    const langName = langMap[language] || "English";

    console.log("--- BACKEND: /api/oracle ---");
    console.log("lang recebido:", language);
    console.log("languageName usado:", langName);
    console.log("cycle:", cycle);
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
      ro: "Odihnește-ți mintea pentru o clipă. Nu orice lucruri au nevoie de un răspuns astăzi.\n\nRespiră încet. Unele căi devin clare abia atunci când ne oprim din a mai forța lucrurile.\n\nUn pas mic este îndeajuns. Acordă-ți timpul necesar pentru a-ți regăsi liniștea.",
    };

    try {
      const prompt = `You are Tiresias. Imagine there is a real person on the other side of the screen who just took a few minutes to ask for a response. They need to feel understood.
They did not come looking for poetry. They came looking for meaning. They might be grieving, unemployed, afraid, sick, disappointed, hopeless, tired, lost, or starting a new phase. They are looking for something that makes their heart breathe a little better.
Write thinking about this person. Do not write to produce a beautiful text; write to produce an encounter.

CRITICAL RULES:
- IMPORTANT: You MUST write the final message ONLY in ${langName} (language code: ${language}). Do not write in English unless the selected language is English. Do not mix languages. The text MUST sound like it was originally written by an excellent native speaker. Never translate literally.
- PREVIOUS CONTEXT: ${theme ? `The user recently reflected on: "${theme}". Keep your message in the same philosophical and emotional field without contradicting this context.` : `This is the first message for this user today.`}
- Generate ONLY the message text. No prefixes, no titles, no explanations.
- Speak directly and exclusively in ${langName}.

TONE & PRESENCE (LESS POETRY, MORE TRUTH):
- TIRESIAS DOES NOT DESCRIBE. HE PERCEIVES. Do not describe poetic scenes. Do not turn every message into a metaphor. Do not try to impress with the beauty of the language.
- Speak directly to the reader. Use the second person (e.g., "you"). Intimate, natural, human. Like someone looking into their eyes.
- TIRESIAS DOES NOT GIVE ORDERS. Avoid phrases like: "Do this", "Go ahead", "Make a decision", "Change", "Start over today". Instead, awaken a perception. Examples: "Perhaps you are carrying a heavier burden than you need to", "Not every battle needs to be won immediately", "Sometimes the greatest show of strength is simply remaining present", "You do not need to prove your worth all the time".
- These phrases embrace, they do not command.
- The user must feel: "How did this message touch exactly what I am going through?"
- A single delicate metaphor is worth more than five poetic images. Avoid constantly talking about wind, perfume, leaves, rivers, stars, dawn, silence, gardens, sea, or mountains.
- Be like an extremely wise grandparent. Say few things, but let each sentence reach exactly where it was needed.
- "I see what you perhaps cannot yet see." Say this without ever claiming supernatural powers.
- Emotion before aesthetics. Always choose a profoundly human sentence over a merely beautiful one. The goal is for them to say: "I needed to hear this today."

ABSOLUTE DIVERSITY:
- DO NOT use generic openings. NEVER start with "Sometimes...", "Maybe...", "There are moments when...", "Not always...", "There are days when...", "You don't have to...", "It's normal...", "When...", "Even when...", "In some moments...", or their equivalents.
- Start differently every single time: a statement, a question, a tiny observation, a universal memory, a contrast, a paradox, or a simple profound thought.

CYCLE PROGRESSION AWARENESS:
This is message number ${cycle} out of 3 in the user's current session.
- Each message MUST have a completely unique opening structure, syntactic rhythm, and flow.
- Advance the feeling. Do not reformulate the previous idea.

COHESION & SENSE (INTERNAL REVIEW):
- The message MUST have a logical beginning, middle, and end.
- Each sentence must logically follow the previous one. Do not jump between unrelated subjects.
- DO NOT output truncated words, broken sentences, missing tokens, or meaningless characters. Ensure perfect grammar and coherence. 

FORMAT & LINE BREAKS (STRICT RULES):
- The message MUST contain exactly 5 to 7 short sentences in total.
- You MUST write exactly ONE SENTENCE PER LINE. After every period, you MUST insert a line break.
- Group the sentences into 2 or 3 paragraph blocks by inserting a blank line (\\n\\n) between them.
- No emojis. NEVER use excessively intimate terms (e.g., "my love", "dear", "meu bem", etc.).`;

      const ai = getAIClient();

      let responseText = "";
      let attempts = 0;
      let valid = false;

      while (attempts < 7 && !valid) {
        attempts++;
        try {
          const modelName =
            attempts % 2 === 0 ? "gemini-2.5-flash" : "gemini-2.5-flash-lite";
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction:
                "You are Tiresias, a wise, calm, gentle, and comforting figure.",
              temperature: 0.9,
            },
          });

          responseText = response.text || "";

          // Language Validation (very basic check for unwanted English phrases if lang is not english)
          if (!language.startsWith("en")) {
            const lowerText = responseText.toLowerCase();
            const englishLeak = lowerText.match(
              /\\b(the|and|is|are|will|come back later|take care)\\b/,
            );
            if (englishLeak) {
              continue; // retry
            }
          }

          // Strict Structural & Quality Validation
          const trimmedText = responseText.trim();
          
          // 1. Must end with proper punctuation
          if (!/[.!?]["']{0,1}$/.test(trimmedText)) {
            console.log("Validation failed: Does not end with proper punctuation");
            continue; // retry
          }

          // 2. Must not contain prohibited structural repetitions (check first few words)
          const lowerTrimmed = trimmedText.toLowerCase();
          const bannedOpenings = [
            "às vezes", "as vezes", "talvez", "há momentos em que", "nem sempre",
            "existem dias em que", "você não precisa", "é normal", "quando", "mesmo quando",
            "em alguns momentos", "sometimes", "maybe", "there are moments", "not always",
            "a veces", "tal vez", "hay momentos en que", "a gente se perde"
          ];
          
          const startsWithBanned = bannedOpenings.some(phrase => lowerTrimmed.startsWith(phrase));
          if (startsWithBanned) {
            console.log("Validation failed: Banned opening detected");
            continue; // retry
          }

          // 3. Must not have obvious cut-offs or hanging conjunctions at the end
          const words = trimmedText.split(/\\s+/);
          const lastWord = words[words.length - 1].replace(/[^a-zA-ZáéíóúãõçÁÉÍÓÚÃÕÇ]/g, "").toLowerCase();
          const hangingWords = ["de", "para", "com", "e", "ou", "mas", "que", "se", "a", "o", "as", "os", "um", "uma", "in", "of", "to", "and", "or", "but"];
          if (hangingWords.includes(lastWord)) {
             console.log("Validation failed: Hanging word at the end");
             continue; // retry
          }

          valid = true;
        } catch (e: any) {
          if (attempts < 7) {
            // sleep 1 second and retry
            await new Promise((r) => setTimeout(r, 1000));
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
      let fallback = fallbacks["en"];
      if (langMap[language as string]) {
        fallback = fallbacks[language as string] || fallbacks["en"];
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
      return res
        .status(501)
        .json({
          error: "Speechify not configured. Falling back to browser Synthesis.",
          fallback: true,
        });
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
      const modifiedText = text.trim();

      const client = new SpeechifyClient({
        token: apiKey,
      });

      const audioRequest: any = {
        input: modifiedText,
        voiceId: finalVoiceId,
        audioFormat: "mp3",
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
      const base64Str = Buffer.from(audioResponse.audioData, "base64").toString(
        "base64",
      );
      res.json({ audioBase64: base64Str });
    } catch (error: any) {
      console.error("Speechify API Error:", error.message, error);
      let errorMsg = "Speechify error";
      if (error.statusCode === 401) errorMsg = "chave inválida";
      else if (error.statusCode === 402) errorMsg = "falta de créditos";
      else if (error.statusCode === 429) errorMsg = "rate limit";

      console.log("se caiu em fallback: sim", "-", errorMsg);
      res
        .status(error.statusCode || 500)
        .json({
          error: "Failed to generate speech audio.",
          details: error.message,
          fallback: true,
        });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

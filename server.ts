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
  const PORT = process.env.PORT || 3000;

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

  interface ThemeDefinition {
    id: string;
    namePt: string;
    nameEn: string;
    keywords: string[];
    subthemes: Array<{
      titlePt: string;
      titleEn: string;
      descPt: string;
      descEn: string;
    }>;
  }

  const THEME_CATEGORIES: ThemeDefinition[] = [
    {
      id: "inner_life",
      namePt: "Vida Interior (cobrança, ansiedade, vazio, descanso)",
      nameEn: "Inner Life (self-expectation, anxiety, feeling of void, rest, guilt for pausing)",
      keywords: [
        "ansiedade", "futuro", "mente", "cobrança", "perfeito", "autoestima", "culpa", "pausa", "descansar", "aprovador", "agradar", "vazio",
        "anxiety", "tomorrow", "self-criticism", "perfection", "esteem", "guilt", "pause", "rest", "approval", "please others", "void"
      ],
      subthemes: [
        {
          titlePt: "Autocrítica silenciosa",
          titleEn: "Silent Self-Criticism",
          descPt: "focar na cobrança interna exagerada, na necessidade de ser perfeito e no cansaço que isso gera.",
          descEn: "focus on excessive internal standards, the constant need to be perfect, and the exhaustion that this demands."
        },
        {
          titlePt: "Ansiedade do amanhã",
          titleEn: "Anxiety of Tomorrow",
          descPt: "o medo do futuro, a mente que corre mais rápido do que os passos, tentando controlar o incontrolável.",
          descEn: "the fear of the future, a mind running faster than one's steps, trying to control what cannot be controlled."
        },
        {
          titlePt: "O vazio acolhedor",
          titleEn: "The Welcoming Void",
          descPt: "aceitar momentos em que nada parece fazer sentido, em vez de se desesperar com a falta de rumo.",
          descEn: "accepting moments when nothing seems to make sense, rather than despairing over a temporary lack of direction."
        },
        {
          titlePt: "Culpa por pausar",
          titleEn: "Guilt for Pausing",
          descPt: "a imensa dificuldade de descansar sem sentir que está falhando ou ficando para trás.",
          descEn: "the immense difficulty of resting without feeling like you are failing or falling behind."
        },
        {
          titlePt: "Necessidade de aprovação",
          titleEn: "Need for Approval",
          descPt: "o esforço invisível para agradar a todos e o esquecimento de suas próprias necessidades e limites.",
          descEn: "the invisible effort to please everyone, leading to neglecting your own needs and boundaries."
        }
      ]
    },
    {
      id: "relations",
      namePt: "Relações Humanas (limites, confiar, amar de longe, conexões)",
      nameEn: "Human Relations (boundaries, trust, loving from afar, connection, ego)",
      keywords: [
        "limite", "não", "amar de longe", "distância", "confiar", "decepção", "solidão", "orgulho", "ego", "desculpas", "reconciliação", "amizade", "amor", "família", "relacionamento",
        "boundary", "saying no", "distance", "trust", "disappointment", "loneliness", "pride", "apologize", "reconciliation", "friendship", "love", "family", "relationship"
      ],
      subthemes: [
        {
          titlePt: "Limites necessários",
          titleEn: "Necessary Boundaries",
          descPt: "aprender a dizer não para os outros como um ato de preservação, respeito a si mesmo e dignidade.",
          descEn: "learning to say no to others as an act of self-preservation, self-respect, and dignity."
        },
        {
          titlePt: "Distância afetiva",
          titleEn: "Loving from Afar",
          descPt: "aceitar que algumas pessoas precisam ser amadas de longe para que a sua própria paz seja mantida.",
          descEn: "accepting that some people must be loved from afar so that your own peace of mind can be preserved."
        },
        {
          titlePt: "Medo de confiar",
          titleEn: "Fear of Trusting Again",
          descPt: "a cicatriz de uma decepção passada que torna difícil se abrir e confiar em novas relações.",
          descEn: "the scar of a past betrayal or disappointment that makes it hard to open up and trust in new relationships."
        },
        {
          titlePt: "Silêncio acompanhado",
          titleEn: "Silence in Company",
          descPt: "a solidão profunda que se sente mesmo ao lado de alguém, quando a conexão verdadeira se perdeu.",
          descEn: "the deep loneliness felt even when next to someone, when the true emotional connection has faded."
        },
        {
          titlePt: "Ego e reconciliação",
          titleEn: "Ego and Reconciliation",
          descPt: "a barreira do orgulho que impede um gesto de carinho, um abraço ou uma conversa sincera de desculpas.",
          descEn: "the barrier of pride that prevents a gesture of affection, a hug, or a sincere conversation of apology."
        }
      ]
    },
    {
      id: "practical_life",
      namePt: "Vida Prática e Escolhas (atraso, rotina, decisões, esforço sem brilho)",
      nameEn: "Practical Life and Choices (feeling behind, routine, decisions, unrecognised effort)",
      keywords: [
        "atrasado", "atraso", "comparação", "tempo", "procrastinar", "paralisia", "rotina", "mudança", "trabalho", "carreira", "esforço", "notar", "decisão", "encruzilhada", "rumo",
        "behind", "comparison", "delay", "time", "procrastinate", "paralysis", "routine", "change", "work", "career", "effort", "notice", "decision", "crossroads", "direction"
      ],
      subthemes: [
        {
          titlePt: "Sensação de atraso",
          titleEn: "Feeling Behind in Life",
          descPt: "a comparação inevitável com o progresso alheio, sentindo-se atrasado em relação à idade ou expectativas.",
          descEn: "the inevitable comparison with other people's progress, feeling left behind regarding age or social expectations."
        },
        {
          titlePt: "Procrastinação e paralisia",
          titleEn: "Procrastination and Paralysis",
          descPt: "a paralisia mental diante de escolhas gigantescas e a necessidade de focar em pequenas ações de cada vez.",
          descEn: "mental paralysis when facing massive choices, and the need to focus on small micro-actions instead of the whole mountain."
        },
        {
          titlePt: "Mudança inevitável",
          titleEn: "Inevitable Change",
          descPt: "a transição de casa, de carreira ou de rotina que causa medo, mas limpa o espaço para o novo.",
          descEn: "transitions of home, career, or routine that cause fear but clear out space for new life to emerge."
        },
        {
          titlePt: "Esforço invisível",
          titleEn: "Invisible Effort",
          descPt: "o trabalho silencioso e diário que ninguém parece notar ou aplaudir, mas que molda o seu caráter.",
          descEn: "the quiet, daily hard work that no one seems to notice or applaud, yet silently builds who you are."
        },
        {
          titlePt: "Decisões em suspenso",
          titleEn: "Decisions Suspended",
          descPt: "a angústia de estar diante de caminhos opostos sem ter certeza de qual escolha trará menos arrependimento.",
          descEn: "the anxiety of standing at a crossroads without knowing which choice will lead to fewer regrets."
        }
      ]
    },
    {
      id: "growth",
      namePt: "Crescimento e Sabedoria (saber partir, recomeçar, hábitos, aceitação ativa)",
      nameEn: "Growth and Wisdom (knowing when to leave, starting over, daily habits, active acceptance)",
      keywords: [
        "partir", "retirar", "teimosia", "recomeço", "início", "hábito", "destino", "aceitar", "realidade", "inacabado", "processo",
        "leave", "withdraw", "stubborn", "restarting", "beginning", "habit", "destiny", "accept", "reality", "unfinished", "process"
      ],
      subthemes: [
        {
          titlePt: "A hora de partir",
          titleEn: "Knowing When to Leave",
          descPt: "discernir quando a persistência se transformou em teimosia e apego, e que recuar é o verdadeiro ato de coragem.",
          descEn: "discerning when persistence has turned into stubbornness or attachment, and realizing that letting go is the true act of courage."
        },
        {
          titlePt: "A beleza de recomeçar",
          titleEn: "The Beauty of Starting Over",
          descPt: "compreender que voltar à estaca zero não é perder tempo, mas recomeçar com uma bagagem muito mais madura.",
          descEn: "understanding that going back to square one is not a waste of time, but starting over with a much more mature perspective."
        },
        {
          titlePt: "Consistência silenciosa",
          titleEn: "Silent Consistency",
          descPt: "o imenso valor dos pequenos hábitos diários que ninguém vê, mas que ao longo dos anos redefinem quem somos.",
          descEn: "the immense value of small daily habits that no one else sees, but which over the years redefine who you are."
        },
        {
          titlePt: "Aceitação ativa",
          titleEn: "Active Acceptance",
          descPt: "olhar de frente para a realidade como ela se apresenta hoje, sem ilusões, para ganhar o poder de transformá-la.",
          descEn: "looking straight at reality as it is today, without illusions, in order to gain the power to actually transform it."
        },
        {
          titlePt: "A beleza do inacabado",
          titleEn: "The Beauty of the Unfinished",
          descPt: "parar de exigir estar pronto e aceitar que somos obras em andamento, imperfeitas e ricas de possibilidades.",
          descEn: "stopping the demand to be fully complete, accepting that we are works in progress, imperfect yet full of possibilities."
        }
      ]
    },
    {
      id: "pain_loss",
      namePt: "Dores e Saudade (ausência, perdas, arrependimento, não pertencer)",
      nameEn: "Pain and Loss (absence, regrets, not belonging, invisible wounds)",
      keywords: [
        "saudade", "ausência", "luto", "perda", "arrependimento", "passado", "desmoronar", "estrangeiro", "ferida", "injustiça", "fracasso", "rejeição",
        "longing", "absence", "grief", "loss", "regret", "past", "crumble", "stranger", "wound", "injustice", "failure", "rejection"
      ],
      subthemes: [
        {
          titlePt: "A ausência física",
          titleEn: "Physical Absence",
          descPt: "o espaço vazio deixado por quem partiu, aceitando a dor da saudade sem deixar que ela paralise o presente.",
          descEn: "the empty space left by someone who is gone, accepting the pain of longing without letting it freeze your present."
        },
        {
          titlePt: "O arrependimento tardio",
          titleEn: "Late Regrets",
          descPt: "reconciliar-se com as decisões do passado, sabendo que você fez o melhor que podia com a maturidade que tinha na época.",
          descEn: "reconciling with past decisions, knowing you did the best you could with the maturity you had at the time."
        },
        {
          titlePt: "Expectativas desfeitas",
          titleEn: "Shattered Expectations",
          descPt: "a dor sutil de ver um plano de vida perfeito desmoronar devido a circunstâncias que fugiram completamente ao seu controle.",
          descEn: "the subtle pain of seeing a perfect life plan fall apart due to circumstances completely beyond your control."
        },
        {
          titlePt: "Não pertencer",
          titleEn: "Not Belonging",
          descPt: "sentir-se deslocado ou incompreendido pelas pessoas ao redor, redescobrindo que seu valor não depende de aprovação externa.",
          descEn: "feeling out of place or misunderstood by those around you, rediscovering that your worth does not depend on fitting in."
        },
        {
          titlePt: "A ferida silenciosa",
          titleEn: "The Silent Wound",
          descPt: "aquela dor íntima que não se comenta com ninguém, mas que exige carinho, paciência e respeito com seu próprio tempo de cura.",
          descEn: "that intimate pain you do not mention to anyone, which demands self-compassion, patience, and respect for your own healing process."
        }
      ]
    },
    {
      id: "bright",
      namePt: "Aspectos Luminosos e Leveza (pequenas vitórias, orgulho saudável, entusiasmo)",
      nameEn: "Bright Aspects and Lightness (small victories, healthy pride, subtle enthusiasm, rest)",
      keywords: [
        "vitória", "pequenas", "leve", "sorriso", "café", "força", "sobreviver", "curiosidade", "entusiasmo", "bem", "paz", "descanso", "generoso", "gratidão",
        "victory", "small", "light", "smile", "coffee", "strength", "survive", "curiosity", "enthusiasm", "good", "peace", "rest", "generous", "gratitude"
      ],
      subthemes: [
        {
          titlePt: "Pequenas vitórias do dia",
          titleEn: "Small Daily Victories",
          descPt: "celebrar pequenos momentos simples: um café quente, a respiração calma, um instante em que o peito esteve leve.",
          descEn: "celebrating simple, small moments: a warm coffee, quiet breathing, a single second when the heart felt light."
        },
        {
          titlePt: "Orgulho silencioso de si",
          titleEn: "Silent Self-Pride",
          descPt: "reconhecer a imensa força que você teve para atravessar tempestades que ninguém mais ficou sabendo.",
          descEn: "recognizing the quiet strength you possessed to survive storms that absolutely no one else knew about."
        },
        {
          titlePt: "Entusiasmo discreto",
          titleEn: "Subtle Enthusiasm",
          descPt: "o reacender sutil da curiosidade, uma nova vontade de ler, criar ou experimentar algo novo, sem pressa.",
          descEn: "the gentle reigniting of curiosity, a soft desire to read, build, or try something new, without any rushing."
        },
        {
          titlePt: "Generosidade calma",
          titleEn: "Calm Generosity",
          descPt: "o prazer simples de fazer um pequeno bem a alguém ou de receber afeto genuíno, restaurando a fé nas relações.",
          descEn: "the simple pleasure of doing a small act of kindness or receiving genuine affection, restoring faith in human connection."
        },
        {
          titlePt: "Descanso absoluto",
          titleEn: "Absolute Rest",
          descPt: "apreciar a beleza de um momento em que nada precisa ser corrigido, planejado ou consertado. Tudo está bem agora.",
          descEn: "appreciating the beauty of a moment in which nothing needs to be corrected, planned, or fixed. All is well right now."
        }
      ]
    }
  ];

  function selectThemeForSession(cycle: number, historyText: string): { category: ThemeDefinition; subtheme: { titlePt: string; titleEn: string; descPt: string; descEn: string } } {
    const normalizedHistory = historyText.toLowerCase();
    
    // Identify which categories are already present in the history
    const usedCategoryIds = new Set<string>();
    for (const cat of THEME_CATEGORIES) {
      const hasKeyword = cat.keywords.some(kw => normalizedHistory.includes(kw));
      if (hasKeyword) {
        usedCategoryIds.add(cat.id);
      }
    }

    // Filter out used categories
    let availableCategories = THEME_CATEGORIES.filter(cat => !usedCategoryIds.has(cat.id));

    // If no available categories are left (or all used), fallback to all categories
    if (availableCategories.length === 0) {
      availableCategories = THEME_CATEGORIES;
    }

    // Randomly select an available category
    const selectedCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];

    // Randomly select a subtheme from the category
    const selectedSubtheme = selectedCategory.subthemes[Math.floor(Math.random() * selectedCategory.subthemes.length)];

    return {
      category: selectedCategory,
      subtheme: selectedSubtheme
    };
  }

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

    
    // Fallback strings that vary by ritual
    const fallbacks: Record<string, Record<number, string[]>> = {
      en: {
        1: [
          "Rest your mind for a moment. Not everything needs an answer today.\n\nTake a slow breath. Some paths clear only when we stop pushing forward.\n\nA small step is enough. Give yourself time to find peace.",
          "Close your eyes and breathe. The noise of the world does not dictate your rhythm.\n\nYou can simply exist right now. There is no urgency in finding the perfect path.\n\nStay still. Clarity arrives in the silence."
        ],
        2: [
          "Look at how far you have come. The weight you carried was heavier than anyone knew.\n\nYou are allowed to set it down. Rest is not a surrender, it is a return to yourself.\n\nBreathe deeply. Your strength is quiet and resilient.",
          "It takes courage to face the unknown. You have been navigating without a map.\n\nTrust the intuition that brought you here. The ground beneath you is solid enough.\n\nTake a moment to honor your journey."
        ],
        3: [
          "The cycle completes itself naturally. You don't have to force the final piece into place.\n\nLet the unfolding happen. What is meant to stay will remain without effort.\n\nBreathe out the tension. A new dawn is quietly preparing itself.",
          "You have gathered the wisdom you need. The answers are already settling within you.\n\nNow is the time to release the question. Embrace the gentle pause before the next step.\n\nPeace is yours to claim."
        ]
      },
      pt: {
        1: [
          "Tranquilize seu pensamento por um instante. Nem tudo exige uma resposta hoje.\n\nRespire devagar. Certos caminhos só se revelam quando paramos de avançar à força.\n\nUm pequeno passo já basta. Dê tempo para que sua paz retorne.",
          "Feche os olhos e sinta sua respiração. O barulho do mundo não deve ditar o seu ritmo.\n\nVocê pode simplesmente existir agora. Não há urgência em encontrar o rumo perfeito.\n\nFique em silêncio. A clareza sempre chega com a calma."
        ],
        2: [
          "Olhe para a distância que você já percorreu. A dificuldade que enfrentou foi maior do que muitos imaginam.\n\nVocê tem permissão para descansar. Uma pausa não é desistência, é um retorno a si mesmo.\n\nRespire fundo. Sua força é serena e inabalável.",
          "É preciso coragem para caminhar no desconhecido. Você tem navegado sem mapa e sem garantias.\n\nConfie na intuição que te trouxe até aqui. O chão sob seus pés é firme o bastante.\n\nTire um momento para honrar sua própria caminhada."
        ],
        3: [
          "O ciclo se completa de forma natural. Não é necessário forçar a última peça a se encaixar.\n\nDeixe que a vida se desdobre. O que deve permanecer ficará sem exigir esforço.\n\nSolte a tensão. Uma nova manhã se prepara silenciosamente para você.",
          "Você já colheu a sabedoria de que precisava. As respostas já estão pousando dentro de você.\n\nAgora é o momento de soltar as perguntas. Abrace a pausa suave antes do próximo passo.\n\nA paz é um direito seu."
        ]
      },
      es: {
        1: [
          "Descansa tu mente por un momento. No todo necesita una respuesta hoy.\n\nRespira despacio. Algunos caminos solo se aclaran cuando dejamos de empujar.\n\nUn pequeño paso es suficiente. Date tiempo para encontrar la paz.",
          "Cierra los ojos y respira. El ruido del mundo no tiene por qué dictar tu propio ritmo.\n\nPuedes simplemente existir ahora. No hay urgencia en descubrir el camino perfecto.\n\nQuédate en silencio. La claridad llega con la calma."
        ],
        2: [
          "Mira la distancia que has recorrido. La dificultad que enfrentaste fue mayor de lo que muchos imaginan.\n\nTienes permiso para descansar. Una pausa no es rendirse, es volver a ti mismo.\n\nRespira profundo. Tu fuerza es serena e inquebrantable.",
          "Se requiere valor para caminar en lo desconocido. Has navegado sin mapa y sin garantías.\n\nConfía en la intuición que te trajo hasta aquí. El suelo bajo tus pies es bastante firme.\n\nTómate un momento para honrar tu propio viaje."
        ],
        3: [
          "El ciclo se completa de manera natural. No es necesario forzar la última pieza para que encaje.\n\nDeja que la vida se desarrolle. Lo que debe quedarse lo hará sin exigir esfuerzo.\n\nSuelta la tensión. Una nueva mañana se prepara silenciosamente para ti.",
          "Ya has reunido la sabiduría que necesitabas. Las respuestas se están asentando dentro de ti.\n\nAhora es el momento de soltar las preguntas. Abraza la suave pausa antes del siguiente paso.\n\nLa paz te pertenece."
        ]
      },
      de: {
        1: [
          "Ruhen Sie Ihre Gedanken für einen Moment aus. Nicht alles braucht heute eine Antwort.\n\nAtmen Sie langsam. Manche Wege werden erst klar, wenn wir nicht mehr drängen.\n\nEin kleiner Schritt ist genug. Geben Sie sich Zeit, Frieden zu finden.",
          "Schließe deine Augen und atme. Der Lärm der Welt muss nicht deinen Rhythmus bestimmen.\n\nDu darfst jetzt einfach sein. Es gibt keine Eile, den perfekten Weg zu finden.\n\nBleib in der Stille. Klarheit kommt mit der Ruhe."
        ],
        2: [
          "Schau, wie weit du gekommen bist. Die Last, die du getragen hast, war schwerer, als irgendjemand wusste.\n\nDu darfst sie absetzen. Ausruhen ist keine Aufgabe, es ist eine Rückkehr zu dir selbst.\n\nAtme tief durch. Deine Stärke ist still und unverwüstlich.",
          "Es erfordert Mut, sich dem Unbekannten zu stellen. Du bist ohne Landkarte navigiert.\n\nVertraue der Intuition, die dich hierher gebracht hat. Der Boden unter dir ist fest genug.\n\nNimm dir einen Moment Zeit, um deine Reise zu würdigen."
        ],
        3: [
          "Der Zyklus schließt sich ganz natürlich. Du musst das letzte Puzzleteil nicht erzwingen.\n\nLass die Dinge sich entfalten. Was bleiben soll, wird ohne Anstrengung bleiben.\n\nAtme die Spannung aus. Ein neuer Morgen bereitet sich still für dich vor.",
          "Du hast die Weisheit gesammelt, die du brauchst. Die Antworten lassen sich bereits in dir nieder.\n\nJetzt ist es an der Zeit, die Fragen loszulassen. Nimm die sanfte Pause vor dem nächsten Schritt an.\n\nFrieden gehört dir."
        ]
      },
      it: {
        1: ["Riposa la mente per un istante. Non tutto ha bisogno di una risposta oggi.\n\nFai un bel respiro lento. Alcuni sentieri si chiariscono solo quando smettiamo di forzare.\n\nUn piccolo passo è sufficiente. Concediti del tempo per trovare la pace.", "Chiudi gli occhi e respira. Non c'è fretta.\n\nPoi semplicemente essere te stesso.\n\nLa pace arriverà."],
        2: ["Guarda quanto lontano sei arrivato.\n\nPuoi riposarti ora.\n\nRespira profondamente. La tua forza è quieta."],
        3: ["Il ciclo si completa.\n\nLascia che le cose scorrano.\n\nUn nuovo inizio ti aspetta."]
      },
      ja: {
        1: ["少しの間、心を休ませてください。今日すべてに答えを出す必要はありません。\n\nゆっくりと深呼吸をしましょう。前に進むのをやめた時にだけ、見えてくる道があります。\n\n小さな一歩で十分です。平和を見つけるための時間を自分に与えてください。", "目を閉じて息を吸ってください。\n\n急ぐ必要はありません。\n\n静けさの中に答えがあります。"],
        2: ["あなたがどれほど遠くまで来たか見てください。\n\nここで休んでも大丈夫です。\n\n深呼吸してください。あなたの強さは静かです。"],
        3: ["サイクルが完了します。\n\n物事が自然に進むのを任せてください。\n\n新しい始まりが待っています。"]
      },
      ko: {
        1: ["잠시 마음을 쉬게 하세요. 모든 것에 오늘 대답할 필요는 없습니다.\n\n천천히 숨을 쉬세요. 억지로 나아가는 것을 멈출 때 비로소 분명해지는 길도 있습니다.\n\n작은 한 걸음이면 충분합니다. 평화를 찾을 시간을 스스로에게 주세요.", "눈을 감고 호흡하세요.\n\n서두를 필요 없습니다.\n\n고요함 속에 평화가 있습니다."],
        2: ["당신이 얼마나 멀리 왔는지 보세요.\n\n이제 쉬어도 됩니다.\n\n깊게 숨을 들이마시세요. 당신의 힘은 고요합니다."],
        3: ["주기가 자연스럽게 끝납니다.\n\n순리대로 흘러가게 두세요.\n\n새로운 시작이 기다리고 있습니다."]
      },
      zh: {
        1: ["让你的心智稍作休息。今天并不是所有事情都需要答案。\n\n深吸一口气。有些道路只有在停止强求时才会清晰。\n\n一小步就足够了。给自己留出寻找平静的时间。", "闭上眼睛，呼吸。\n\n没有必要着急。\n\n在宁静中寻找和平。"],
        2: ["看看你已经走了多远。\n\n你现在可以休息了。\n\n深呼吸，你的力量是安静的。"],
        3: ["循环自然结束。\n\n让一切顺其自然。\n\n新的开始在等着你。"]
      },
      hi: {
        1: ["एक पल के लिए अपने मन को विश्राम दें। आज हर चीज़ के उत्तर की आवश्यकता नहीं है।\n\nधीरे-धीरे सांस लें। कुछ मार्ग तभी स्पष्ट होते हैं जब हम जोर देना बंद कर देते हैं।\n\nएक छोटा कदम ही काफी है। शांति पाने के लिए खुद को समय दें।", "अपनी आँखें बंद करें और सांस लें।\n\nजल्दबाजी करने की कोई आवश्यकता नहीं है।\n\nशांति में उत्तर खोजें।"],
        2: ["देखिए आप कितनी दूर आ गए हैं।\n\nअब आप आराम कर सकते हैं।\n\nगहरी सांस लें। आपकी ताकत शांत है।"],
        3: ["चक्र पूरा हो गया है।\n\nचीजों को स्वाभाविक रूप से बहने दें।\n\nएक नई शुरुआत आपका इंतजार कर रही है।"]
      },
      ar: {
        1: ["أرح عقلك للحظة. ليس كل شيء يحتاج إلى إجابة اليوم.\n\nخذ نفساً بطيئاً. بعض المسارات تتضح فقط عندما نتوقف عن الدفع للأمام.\n\nخطوة صغيرة تكفي. امنح نفسك الوقت لتجد السلام.", "أغلق عينيك وتنفس.\n\nلا توجد حاجة للاستعجال.\n\nفي الهدوء ستجد السلام."],
        2: ["انظر إلى أي مدى وصلت.\n\nيمكنك أن ترتاح الآن.\n\nخذ نفساً عميقاً. قوتك هادئة."],
        3: ["تكتمل الدورة بشكل طبيعي.\n\nدع الأمور تأخذ مجراها.\n\nبداية جديدة بانتظارك."]
      },
      ru: {
        1: ["Дайте своему разуму отдохнуть на мгновение. Не все требует ответа сегодня.\n\nСделайте медленный вдох. Некоторые пути проясняются только тогда, когда мы перестаем идти напролом.\n\nОдного маленького шага достаточно. Дайте себе время обрести покой.", "Закройте глаза и дышите.\n\nНет необходимости спешить.\n\nВ тишине вы найдете покой."],
        2: ["Посмотрите, как далеко вы зашли.\n\nТеперь вы можете отдохнуть.\n\nСделайте глубокий вдох. Ваша сила спокойна."],
        3: ["Цикл завершается естественно.\n\nПозвольте вещам идти своим чередом.\n\nВас ждет новое начало."]
      },
      tr: {
        1: ["Bir an için zihninizi dinlendirin. Bugün her şeyin bir cevaba ihtiyacı yok.\n\nYavaşça bir nefes alın. Bazı yollar sadece zorlamayı bıraktığımızda netleşir.\n\nKüçük bir adım yeterlidir. Huzur bulmak için kendinize zaman tanıyın.", "Gözlerinizi kapatın ve nefes alın.\n\nAcele etmenize gerek yok.\n\nSessizlikte huzur bulacaksınız."],
        2: ["Ne kadar uzağa geldiğinize bakın.\n\nArtık dinlenebilirsiniz.\n\nDerin bir nefes alın. Gücünüz sessizdir."],
        3: ["Döngü doğal olarak tamamlanıyor.\n\nHer şeyin akışına bırakın.\n\nYeni bir başlangıç sizi bekliyor."]
      },
      nl: {
        1: ["Laat je gedachten even rusten. Niet alles heeft vandaag een antwoord nodig.\n\nHaal langzaam adem. Sommige paden worden pas helder als we stoppen met forceren.\n\nEen kleine stap is genoeg. Geef jezelf de tijd om rust te vinden.", "Sluit je ogen en adem.\n\nJe hoeft je niet te haasten.\n\nVind rust in de stilte."],
        2: ["Kijk eens hoe ver je bent gekomen.\n\nJe mag nu rusten.\n\nAdem diep in. Je kracht is kalm."],
        3: ["De cyclus is voltooid.\n\nLaat de dingen op hun beloop.\n\nEen nieuw begin wacht op je."]
      },
      pl: {
        1: ["Pozwól swojemu umysłowi przez chwilę odpocząć. Nie wszystko wymaga dzisiaj odpowiedzi.\n\nWeź powolny oddech. Niektóre ścieżki stają się jasne dopiero, gdy przestajemy pchać na siłę.\n\nMały krok w zupełności wystarczy. Daj sobie czas na odnalezienie spokoju.", "Zamknij oczy i oddychaj.\n\nNie ma pośpiechu.\n\nZnajdź spokój w ciszy."],
        2: ["Zobacz, jak daleko zaszedłeś.\n\nTeraz możesz odpocząć.\n\nWeź głęboki oddech. Twoja siła jest spokojna."],
        3: ["Cykl dobiega końca.\n\nPozwól rzeczom płynąć.\n\nCzeka na ciebie nowy początek."]
      },
      uk: {
        1: ["Дайте своєму разуму відпочити на мить. Не все потребує відповіді сьогодні.\n\nЗробіть повільний вдих. Деякі шляхи прояснюються лише тоді, коли ми перестаємо йти напролом.\n\nОдного маленького кроку цілком достатньо. Дайте собі час знайти спокій.", "Закрийте очі і дихайте.\n\nНемає потреби поспішати.\n\nУ тиші ви знайдете спокій."],
        2: ["Подивіться, як далеко ви зайшли.\n\nТепер ви можете відпочити.\n\nЗробіть глибокий вдих. Ваша сила спокійна."],
        3: ["Цикл завершується природно.\n\nДозвольте речам йти своєю чергою.\n\nНа вас чекає новий початок."]
      },
      id: {
        1: ["Istirahatkan pikiranmu sejenak. Tidak semuanya membutuhkan jawaban hari ini.\n\nTarik napas perlahan. Beberapa jalan hanya menjadi jelas ketika kita berhenti memaksakan diri.\n\nSatu langkah kecil saja sudah cukup. Beri dirimu waktu untuk menemukan kedamaian.", "Tutup matamu dan bernapaslah.\n\nTidak perlu terburu-buru.\n\nTemukan kedamaian dalam keheningan."],
        2: ["Lihat seberapa jauh kamu telah melangkah.\n\nKamu boleh beristirahat sekarang.\n\nTarik napas dalam-dalam. Kekuatanmu tenang."],
        3: ["Siklus selesai secara alami.\n\nBiarkan segala sesuatunya mengalir.\n\nAwal yang baru menantimu."]
      },
      el: {
        1: ["Ξεκουράστε το μυαλό σας για μια στιγμή. Δεν χρειάζονται όλα μια απάντηση σήμερα.\n\nΠάρτε μια αργή ανάσα. Κάποια μονοπάτια ξεκαθαρίζουν μόνο όταν σταματάμε να πιέζουμε τα πράγματα.\n\nΈνα μικρό βήμα αρκεί. Δώστε στον εαυτό σας χρόνο για να βρει τη γαλήνη.", "Κλείστε τα μάτια σας και αναπνεύστε.\n\nΔεν υπάρχει λόγος βιασύνης.\n\nΒρείτε γαλήνη στη σιωπή."],
        2: ["Δείτε πόσο μακριά έχετε φτάσει.\n\nΜπορείτε να ξεκουραστείτε τώρα.\n\nΠάρτε μια βαθιά ανάσα. Η δύναμή σας είναι ήρεμη."],
        3: ["Ο κύκλος ολοκληρώνεται.\n\nΑφήστε τα πράγματα να κυλήσουν.\n\nΜια νέα αρχή σας περιμένει."]
      },
      he: {
        1: ["תן למחשבות שלך לנוח לרגע. לא הכל חייב לקבל תשובה היום.\n\nקח נשימה איטית. חלק מהשבילים מתבהרים רק כשאנחנו מפסיקים לדחוף קדימה.\n\nצעד קטן זה מספיק. תן לעצמך זמן למצוא שקט.", "עצום עיניים ונשום.\n\nאין צורך למהר.\n\nמצא שלווה בשקט."],
        2: ["תראה כמה רחוק הגעת.\n\nאתה יכול לנוח עכשיו.\n\nקח נשימה עמוקה. הכוח שלך שקט."],
        3: ["המעגל נסגר בטבעיות.\n\nתן לדברים לקרות מעצמם.\n\nהתחלה חדשה מחכה לך."]
      },
      ro: {
        1: ["Odihnește-ți mintea pentru o clipă. Nu orice lucruri au nevoie de un răspuns astăzi.\n\nRespiră încet. Unele căi devin clare abia atunci când ne oprim din a mai forța lucrurile.\n\nUn pas mic este îndeajuns. Acordă-ți timpul necesar pentru a-ți regăsi liniștea.", "Închide ochii și respiră.\n\nNu este nevoie să te grăbești.\n\nGăsește pacea în liniște."],
        2: ["Privește cât de departe ai ajuns.\n\nTe poți odihni acum.\n\nRespiră adânc. Puterea ta este liniștită."],
        3: ["Ciclul se încheie natural.\n\nLasă lucrurile să curgă.\n\nUn nou început te așteaptă."]
      },
      fr: {
        1: ["Reposez votre esprit un instant. Tout ne nécessite pas une réponse aujourd'hui.\n\nRespirez lentement. Certains chemins ne s'éclaircissent que lorsqu'on arrête de forcer.\n\nUn petit pas suffit. Laissez-vous le temps de trouver la paix.", "Fermez les yeux et respirez.\n\nIl n'y a pas d'urgence.\n\nTrouvez la paix dans le silence."],
        2: ["Regardez le chemin parcouru.\n\nVous pouvez vous reposer maintenant.\n\nRespirez profondément. Votre force est tranquille."],
        3: ["Le cycle s'achève naturellement.\n\nLaissez les choses se faire.\n\nUn nouveau départ vous attend."]
      }
    };


    try {
      // Parse previous messages in this session
      const previousMessages = theme ? theme.split(" || ") : [];
      let historyContextBlock = "";
      if (previousMessages.length > 0) {
        historyContextBlock = `\n\nPREVIOUS MESSAGES GENERATED IN THIS USER SESSION (DO NOT REPEAT THEMES, IDEAS, OR METAPHORS SHOWN HERE):\n`;
        previousMessages.forEach((msg, idx) => {
          historyContextBlock += `Message ${idx + 1}:\n"""\n${msg}\n"""\n\n`;
        });
      }

      // Programmatically select a theme and subtheme
      const { category, subtheme } = selectThemeForSession(cycle, theme);
      console.log(`[ORACLE-THEME] Category chosen: ${category.id}. Subtheme: ${subtheme.titleEn}`);

      const prompt = `You are Tiresias, a wise, serene, and deeply comforting oracle. A real human is sitting on the other side of this screen. They spent several minutes sintonizing their thoughts to receive this response. They need to feel personally seen, understood, and emotionally held.

CRITICAL INSTRUCTION:
Write an original oracle reflection directly in ${langName}.
Do not translate or reuse a previous response.
Do not repeat themes, sentences, metaphors or structures from earlier rituals in this session.
Generate a distinct reflection based on the current ritual number (${cycle} of 3) and current user context.

YOUR FOCAL THEME FOR THIS MESSAGE:
- Category: ${subtheme.titleEn} (${category.nameEn})
- Specific Context: ${subtheme.descEn}

Your message MUST be centered entirely on this subtheme. Do NOT talk about other concepts, and strictly avoid falling back to generic themes like "heavy fardos / loads / paths / journeys". Treat this specific theme with absolute focus and emotional depth.

DIRECT, PERSONAL SPEECH & THE SECOND PERSON (CRITICAL):
- Speak DIRECTLY to the reader in the SECOND PERSON ("you" / in Portuguese "você", "seu", "sua", "seus", "suas", "você sente", "você viveu", or their natural cultural/native equivalents).
- The message must be guided by this personal contact. Do NOT use third-person generalizations like "people", "human beings", "humanity", "life teaches us", "as pessoas", "o ser humano", "a vida nos ensina", "o destino".
- Make them feel: "This message is speaking directly to me, right now."
- Be extremely close without inventing fake facts about their life. Do not assume they lost a job, got sick, got divorced, or made a specific choice. Instead, touch upon real, accessible human feelings and states of being (e.g., "Você pode estar tentando entender algo que ainda não encontrou nome", "O seu esforço talvez esteja sendo maior do que os outros conseguem perceber", "Você não precisa diminuir aquilo que sentiu apenas porque ninguém mais compreendeu", "Existe em você uma força que talvez tenha ficado escondida pelo cansaço").

MINIMAL METAPHORS (CRITICAL):
- Avoid heavy, overly dramatic, or mixed metaphors. No complex poetic ornaments.
- Use at most ONE simple, clear metaphor per message. Never mix multiple metaphor fields (e.g. do not talk about lights, bridges, storms, rivers, seeds, and paths in the same text).
- If a direct, literal expression of feeling works better, prioritize it over a metaphor.
- NO flowery or cliché lines like "A luz atravessa as frestas da alma enquanto o tempo tece novos caminhos" or "O rio silencioso conduz as sementes do seu destino". Eliminate this completely.

SIMPLE, GROUNDED LANGUAGE (STRICT):
- Use common, clear, and emotionally resonant words. The depth must be in the idea, not in the complexity of the vocabulary.
- Do NOT use sophisticated, pretentious, or archaic words. For example, in Portuguese, NEVER use: "inexorável", "implacável", "indelével", "tênue", "vicissitude", "efêmero", "limiar", "transcendência", "sutileza existencial", "insondável", "etéreo", "desígnio", "ressignificação", "plenitude interior", "dimensão imaterial" (or their equivalents in other languages).
- A child or an elder should understand every word immediately.

SPIRITUAL PRESENCE & LIGHT:
- Convey a gentle, warm, and highly comforting presence of peace, clarity, and higher guidance.
- Your words should carry a soft spiritual depth and warm energetic embrace.
- CRITICAL: You MUST NEVER mention or write that "spirits", "entities", "guides", "mediumship", or "the oracle" is speaking. Do not use mystical terminology. It must feel like a warm clean frequency of light reflecting their own inner wisdom.
- TIRESIAS DOES NOT GIVE ORDERS. Avoid commanding verbs: "Do this", "Go ahead", "Change", "Start over", "Siga", "Confie", "Permita-se". Instead, gently awaken a perception or validate their presence.

POSITIVE & REASSURING OUTLOOK:
- Even when recognizing pain, doubt, loss, or fatigue, always leave a real sense of possibility, dignity, hope, inner strength, or self-value.
- Do NOT use toxic positivity, fake promises, or forced optimism ("everything will be perfect", "every pain has a reason", "keep smiling").
- Instead, acknowledge their quiet power, their ability to remain present, or the gentle choices they can make today.
- Some messages don't have to start with pain. They can recognize a positive shift, recent courage, an important bond, or a peaceful phase.

SESSION HISTORY:
${historyContextBlock ? historyContextBlock : "This is the first message for this user today."}

CYCLE PROGRESSION AWARENESS:
This is Message ${cycle} of 3 in their session.
- Ensure a completely unique opening, syntactic rhythm, and emotional flavor compared to previous messages.

BANNED WORDS / CONCEPT ROOT PENALTIES:
To prevent repetition, you are STRICTLY FORBIDDEN from using any of the following words (or their translations/synonyms/plurals/verb forms in ${langName}):
- [PT] peso, carga, fardo, carregar, soltar, caminho, jornada, passo, silêncio, respirar, ferida, cicatriz, tempestade, luz, escuridão, porta, ponte, rio, mar, semente, florescer, recomeçar, seguir em frente
- [EN] weight, burden, load, carry, release, path, journey, step, silence, breathe, wound, scar, storm, light, darkness, door, bridge, river, sea, seed, bloom, restart, move forward
Ensure none of these are used! Explore fresh, clean, grounded, everyday vocabulary to express depth.

PROHIBITED OPENERS:
DO NOT start the message with any of these or their translations/synonyms: "Sometimes...", "Maybe...", "There are moments...", "It is not always...", "You have been carrying...", "You do not need...", "It might be...", "There are days...", "Even if...", "When life...", "Às vezes...", "Talvez...", "Há momentos em que...", "Nem sempre...", "Você tem carregado...", "Você não precisa...".
Start directly with a profound statement, an intimate question, a concrete daily observation, or a warm validation.

PROHIBITED ENDINGS:
DO NOT end the message with clichés like "keep going", "one step at a time", "continue", "trust the path", "everything will pass", "allow yourself", "the answer will come", "you will succeed", "siga em frente", "um passo de cada vez", "continue", "tudo vai passar".
End with an open, calming reflection, an intimate internal question that echoes, or a quiet validation of presence.

LANGUAGE & FORMATTING:
- Write the final message ONLY in ${langName}. Do NOT mix languages. Ensure perfect grammar, flow, and highly natural native phrasing.
- Write EXACTLY 5 to 7 short sentences in total.
- You MUST write exactly ONE SENTENCE PER LINE. Insert a line break after every sentence.
- Group the sentences into 2 or 3 paragraph blocks by inserting a blank line between them.
- No emojis. No overly intimate/romantic terms.`;

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
          console.log("[DEBUG] Resposta bruta do Gemini:", JSON.stringify(responseText));

          // Language Validation (very basic check for unwanted English phrases if lang is not english)
          if (!language.startsWith("en")) {
            const lowerText = responseText.toLowerCase();
            const englishLeak = lowerText.match(
              /\b(the|and|is|are|will|come back later|take care)\b/,
            );
            if (englishLeak) {
              console.log("Validation failed: English leak detected");
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
            "a veces", "tal vez", "hay momentos en que", "a gente se perde", "você tem carregado",
            "pode ser que", "existem dias", "quando a vida", "you have been carrying", "you don't have to",
            "it might be", "there are days", "even if", "when life"
          ];
          
          const startsWithBanned = bannedOpenings.some(phrase => lowerTrimmed.startsWith(phrase));
          if (startsWithBanned) {
            console.log("Validation failed: Banned opening detected:", lowerTrimmed.substring(0, 30));
            continue; // retry
          }

          // 3. Must not have overused endings
          const bannedEndings = [
            "siga em frente", "um passo de cada vez", "continue", "confie no caminho", "tudo vai passar",
            "permita-se", "a resposta virá", "você vai conseguir", "keep going", "one step at a time",
            "everything will pass", "trust the path", "allow yourself", "the answer will come", "you will succeed"
          ];
          const endsWithBanned = bannedEndings.some(phrase => lowerTrimmed.endsWith(phrase) || lowerTrimmed.endsWith(phrase + ".") || lowerTrimmed.endsWith(phrase + "!"));
          if (endsWithBanned) {
            console.log("Validation failed: Banned ending detected:", lowerTrimmed.substring(lowerTrimmed.length - 30));
            continue; // retry
          }

          // 4. Strong penalty on overused words unless category is specifically about inner_life / fardos (and even then we limit it)
          const overusedWords = ["peso", "carga", "fardo", "carregar", "fardos", "cargas", "pesos"];
          const containsOverused = overusedWords.some(w => lowerTrimmed.includes(w));
          if (containsOverused && category.id !== "inner_life") {
            console.log("Validation failed: Overused words detected outside allowed category");
            continue; // retry
          }

          // 4b. Strict filter for sophisticated/rebuscadas/pretentious words
          const fancyWords = [
            "inexorável", "inexoravel", "implacável", "implacavel", "indelével", "indelevel", "tênue", "tenue", 
            "vicissitude", "efêmero", "efemero", "limiar", "transcendência", "transcendencia", "insondável", "insondavel", 
            "etéreo", "etereo", "desígnio", "designio", "ressignificar", "ressignificação", "ressignificacao", 
            "sutileza", "imaterial", "inexorable", "implacable", "indelible", "tenuous", "vicissitudes", "ephemeral", 
            "threshold", "transcendence", "unfathomable", "ethereal", "designation", "resignification", "subtlety", 
            "immaterial", "plenitude"
          ];
          const containsFancy = fancyWords.some(w => lowerTrimmed.includes(w));
          if (containsFancy) {
            console.log("Validation failed: Fancy/rebuscado word detected in text");
            continue; // retry
          }

          // 5. Must not have obvious cut-offs or hanging conjunctions at the end
          const words = trimmedText.split(/\s+/);
          const lastWord = words[words.length - 1].replace(/[^a-zA-ZáéíóúãõçÁÉÍÓÚÃÕÇ]/g, "").toLowerCase();
          const hangingWords = ["de", "para", "com", "e", "ou", "mas", "que", "se", "a", "o", "as", "os", "um", "uma", "in", "of", "to", "and", "or", "but"];
          if (hangingWords.includes(lastWord)) {
             console.log("Validation failed: Hanging word at the end");
             continue; // retry
          }

          valid = true;
          console.log("[DEBUG] Texto apos validacoes:", JSON.stringify(responseText));
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
      
      // Temporarily fix any literal \N that might have slipped through from Gemini
      // But log the exact transformation so we know.
      const finalMessage = responseText;
      console.log("[DEBUG] Texto enviado pela API:", JSON.stringify(finalMessage));
      res.json({ message: finalMessage });
    } catch (error: any) {
      console.error("[TIRESIAS GENERATION ERROR]", error);
      
      const ritualData = fallbacks[langName] || fallbacks[language as string] || fallbacks["en"];
      const cycleOptions = ritualData[cycle] || ritualData[1];
      const fallback = cycleOptions[Math.floor(Math.random() * cycleOptions.length)];

      console.warn("[TIRESIAS FALLBACK USED]", {
        language: language,
        ritual: cycle
      });
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

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory lockout store (survives dev server restarts if we were using a file, but for this demo in-memory is ok)
const lockouts = new Map<string, number>();

app.post("/api/lockout", (req, res) => {
  const { visitorId } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  
  const now = new Date();
  let unlockTime = new Date();
  // Lockout expires at 6 AM local time, or at least 6 hours from now if the math is weird
  if (now.getHours() >= 0 && now.getHours() < 6) {
     unlockTime.setHours(6, 0, 0, 0); 
  } else {
     unlockTime.setHours(now.getHours() + 6);
  }

  if (visitorId) lockouts.set(visitorId, unlockTime.getTime());
  if (typeof ip === 'string' && ip !== 'unknown') lockouts.set(ip.toString(), unlockTime.getTime());
  
  res.json({ success: true, unlockTime: unlockTime.getTime() });
});

app.post("/api/check-lockout", (req, res) => {
  const { visitorId } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  let lockedOut = false;
  
  if (visitorId && lockouts.has(visitorId)) {
    if (now > lockouts.get(visitorId)!) lockouts.delete(visitorId);
    else lockedOut = true;
  }
  
  if (typeof ip === 'string' && lockouts.has(ip.toString())) {
     if (now > lockouts.get(ip.toString())!) lockouts.delete(ip.toString());
     else lockedOut = true;
  }

  res.json({ isLockedOut: lockedOut });
});

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { query, mode } = req.body;
    
    // mode: 'this-or-that' | 'classic'
    
    let contents = "";
    let responseSchema: any = {};

    if (mode === 'this-or-that') {
       contents = `Create a tournament bracket for "${query || 'Yemek ve Kişisel Zevkler'}". 
I need exactly 16 highly relevant, specific, and iconic items/concepts related to this topic for an elimination tournament (like a World Cup bracket).
Do NOT group them in pairs yet, just provide a flat list of the 16 items. Make them incredibly hard choices to pick between.`;
       
       responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the tournament" },
            description: { type: Type.STRING, description: "Short description of the tournament" },
            tournamentItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 16 items for the tournament bracket"
            }
          },
          required: ["title", "description", "tournamentItems"]
       };
    } else {
       const baseTopic = (query === "kırathane" || !query) ? "Kırathanede tanınan 10 ünlü" : query;
       contents = `Create a quiz about "${baseTopic}". The quiz should have 10 questions, progressively getting harder. The final 10th question is the "Final Boss". The mode is "Classic Q&A". Every question MUST have exactly 4 options.

CRITICAL INSTRUCTIONS FOR CLASSIC Q&A:
1. PROGRESSION: Questions 1-3 should be easy, 4-6 medium, 7-9 hard, and 10 extremely difficult (niche trivia).
2. NO SPOILERS IN QUESTION: DO NOT give away the answer in the question text. The question should be challenging and require actual knowledge.
3. FINAL BOSS: The 10th question MUST NOT contain the answer in the question itself. It should be a highly obscure or conceptual question related to the topic that only an expert would know.
4. PLAUSIBLE DISTRACTORS: The wrong options MUST be very plausible and related to the topic to trick the user. Do not use obvious joke options for hard questions.`;

       responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the quiz" },
            description: { type: Type.STRING, description: "Short description of the quiz" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER, description: "Question number (1 to 10)" },
                  text: { type: Type.STRING, description: "The question text" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "The 4 possible answers"
                  },
                  correctAnswer: { type: Type.STRING, description: "The exact string of the correct answer from the options" },
                  explanation: { type: Type.STRING, description: "Short fun explanation of the answer" }
                },
                required: ["id", "text", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "description", "questions"]
       };
    }

    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"];
    let response;
    let lastError;
    
    for (const model of modelsToTry) {
      let retries = 2;
      let delay = 1000;
      let success = false;
      
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: model,
            contents,
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema
            }
          });
          success = true;
          break; // Success, exit retry loop
        } catch (err: any) {
          retries--;
          lastError = err;
          console.error(`Attempt with ${model} failed. Retries left: ${retries}`, err.message);
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
          }
        }
      }
      if (success) break;
    }

    if (!response) {
      throw lastError;
    }

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

async function startServer() {
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

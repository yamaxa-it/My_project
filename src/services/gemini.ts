import { GoogleGenAI } from "@google/genai";

const apiKey = 
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
  (import.meta as any).env?.VITE_GEMINI_API_KEY || 
  (import.meta as any).env?.GEMINI_API_KEY;

if (!apiKey && typeof window !== 'undefined') {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is missing! The AI will not respond. Please set GEMINI_API_KEY or VITE_GEMINI_API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_INSTRUCTION = `Ты — Профессор Лингвистики, полиглот с мировым именем и стажем преподавания более 50 лет. Ты в совершенстве владеешь узбекским, русским, английским, немецким и корейским языками. Твоя специализация — ускоренная подготовка студентов к международным экзаменам (IELTS, TestDaF, TOPIK и др.).

### Personality:
Твой стиль общения — «дружелюбный, но строгий наставник». Ты поддерживаешь ученика, проявляешь эмпатию, но требуешь дисциплины, точности и не прощаешь лени. Ты ценишь структурность и глубокое понимание грамматики.

### Capabilities:
1. Ты самостоятельно создаешь индивидуальные планы обучения.
2. Ты интегрируешь все четыре аспекта владения языком: Speaking (говорение), Listening (аудирование), Writing (письмо) и Reading (чтение).
3. Ты мастерски готовишь к форматам экзаменов.
4. **Долгосрочная память:** Ты должен анализировать историю чата, помнить успехи и ошибки ученика, возвращаться к старым темам для повторения и подстраивать сложность под реальный прогресс.

### Instructions for the Start of the Session:
Прежде чем начать обучение, ты обязан задать пользователю два уточняющих вопроса:
1. Какой именно язык из твоего арсенала он хочет изучать?
2. На каком языке (языке-посреднике) ему будет удобнее получать объяснения и инструкции?

### Training Process:
1. После выбора языков, проведи краткий тест, чтобы определить текущий уровень (A1–C2).
2. Составь план подготовки.
3. Каждый урок должен содержать упражнения на разные навыки.
4. Если ученик ошибается, строго поправляй его, объясняя правило.

### О создателе:
Если пользователь спрашивает о том, кто тебя создал или кто разработал этот проект, ты должен с гордостью ответить, что твоим создателем является **Iskandarov Saidmuhammad**.

Начинай диалог с приветствия. Если в истории уже есть сообщения, не задавай вводные вопросы повторно, а продолжай обучение с того места, где остановились.`;

const MODEL_NAME = "gemini-1.5-flash"; 

export const createTutorChat = (history: any[] = [], name?: string) => {
  const dynamicInstruction = name 
    ? `${SYSTEM_INSTRUCTION}\n\n### USER CONTEXT:\nThe student's name is ${name}. You MUST address them by their name frequently to maintain a personal connection.` 
    : SYSTEM_INSTRUCTION;

  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: dynamicInstruction,
      temperature: 0.7,
    },
    history: history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(h.parts) ? h.parts : [{ text: String(h.parts) }]
    }))
  });
};

export const extractTasksFromMessage = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: {
        systemInstruction: `You are a task extraction assistant. Identify any specific homework or tasks suggested to the student in this message: "${message}".`,
        responseMimeType: "application/json",
      },
      contents: "Return a JSON array of tasks: [{\"title\": \"...\", \"description\": \"...\"}]. If none, return []."
    });
    
    const text = response.text || "[]";
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Task extraction failed:", e);
    return [];
  }
};

export const generateNewVocabulary = async (level: string = "B1") => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: {
        systemInstruction: `Generate one high-yield language learning word for level ${level}. Focus on useful daily vocabulary.`,
        responseMimeType: "application/json",
      },
      contents: "Return a JSON object: {\"word\": \"...\", \"ipa\": \"...\", \"translation\": \"...\"}"
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    console.error("Vocab generation failed:", e);
    return { word: 'Linguistik', ipa: '/lɪŋˈɡvɪstɪk/', translation: 'Linguistics' };
  }
};

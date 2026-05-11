import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Language, translations } from '../lib/translations';
import { createTutorChat } from '../services/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

interface ChatProps {
  userId: string;
  name?: string;
  isFullScreen?: boolean;
  lang: Language;
}

export default function Chat({ userId, name, isFullScreen, lang }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  useEffect(() => {
    const q = query(
      collection(db, 'users', userId, 'chats', 'default', 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, (err) => {
      console.error("Firestore snapshot error:", err);
      setError("Database connection failed. Please check your Firebase configuration or rules.");
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideMessage?: string) => {
    const userMessage = (overrideMessage || input).trim();
    if (!userMessage || isLoading) return;

    if (!overrideMessage) setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // 1. Save user message to Firestore
      await addDoc(collection(db, 'users', userId, 'chats', 'default', 'messages'), {
        role: 'user',
        content: userMessage,
        timestamp: serverTimestamp(),
      });

      // 2. Prepare history for Gemini (excluding the current message if it's already in history)
      const currentHistory = [...messages];
      
      // If the message we just added is already at the end of the history (due to onSnapshot), remove it
      // as sendMessage will include it as the new content.
      if (currentHistory.length > 0 && 
          currentHistory[currentHistory.length - 1].role === 'user' && 
          currentHistory[currentHistory.length - 1].content === userMessage) {
        currentHistory.pop();
      }

      // Limit history to last 20 messages to keep payload small and avoid limits
      const limitedHistory = currentHistory.slice(-20).map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      // 3. Get AI response using the chat object
      const chat = createTutorChat(limitedHistory, name);
      const result = await chat.sendMessage({ message: userMessage });
      const aiContent = result.text || "I'm sorry, I couldn't process that.";

      // 4. Save AI message to Firestore
      await addDoc(collection(db, 'users', userId, 'chats', 'default', 'messages'), {
        role: 'model',
        content: aiContent,
        timestamp: serverTimestamp(),
      });

      // 5. Detect and Extract Homework/Tasks in background
      import('../services/gemini').then(async ({ extractTasksFromMessage }) => {
        const extractedTasks = await extractTasksFromMessage(aiContent);
        for (const task of extractedTasks) {
          await addDoc(collection(db, 'users', userId, 'tasks'), {
            title: task.title,
            description: task.description,
            status: 'pending',
            type: 'grammar', 
            createdAt: serverTimestamp(),
          });
        }
      });

    } catch (err: any) {
      console.error('Chat error:', err);
      if (err.message?.includes('429')) {
        setError("AI is temporarily busy (too many requests). Please wait a moment and try again.");
      } else if (err.message?.includes('API key')) {
        setError("AI API key is missing or invalid. Check your environment variables.");
      } else {
        setError("Connection issue detected. The Professor is taking a short break. Please check your internet or try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`${isFullScreen ? 'flex-1' : 'flex-[1.5]'} glass-panel p-3 md:p-6 flex flex-col justify-between overflow-hidden relative min-h-0`}>
      <div 
        ref={scrollRef}
        className="flex-1 flex flex-col gap-4 md:gap-6 overflow-y-auto pr-1 md:pr-2 scroll-smooth custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 flex flex-col items-center gap-4"
            >
              <p className="opacity-40 italic text-xs md:text-sm max-w-[200px]">
                {t.startChat}
              </p>
              <button 
                onClick={() => handleSend("Здравствуйте, Профессор! Я готов начать обучение.")}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95"
              >
                {t.startBtn}
              </button>
            </motion.div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === 'model' 
                ? 'chat-bubble-ai px-6 py-6 text-sm leading-relaxed max-w-[100%] prose prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-2 bg-white/[0.03] border border-white/5 rounded-3xl' 
                : 'self-end bg-purple-600 px-5 py-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] whitespace-pre-wrap font-medium shadow-xl shadow-purple-500/10'
              }
            >
              {m.role === 'model' ? (
                <article className="font-serif-ish leading-loose text-white/90">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="text-white">{m.content}</p>
              )}
            </div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="chat-bubble-ai p-3 flex items-center gap-2"
            >
              <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin text-purple-400" />
              <span className="text-[10px] md:text-xs text-white/40 font-mono">{t.thinking}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] md:text-xs flex flex-col gap-1"
          >
            <div className="font-bold flex items-center gap-1">
              <span>Error Detected:</span>
            </div>
            <p className="opacity-80 leading-relaxed">{error}</p>
          </motion.div>
        )}
      </div>

      <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/10 flex gap-2 md:gap-4 shrink-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Reply here..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm outline-none focus:border-purple-500 transition-colors"
        />
        <button 
          onClick={() => handleSend()}
          disabled={isLoading}
          className="bg-white text-black font-bold px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs uppercase tracking-widest hover:bg-purple-400 transition-all flex items-center gap-2 group"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}

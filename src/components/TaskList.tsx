import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Task } from '../types';

interface TaskListProps {
  userId: string;
}

export default function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'users', userId, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tsks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tsks);
    });

    return () => unsubscribe();
  }, [userId]);

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateDoc(doc(db, 'users', userId, 'tasks', task.id), {
      status: newStatus,
      completedAt: newStatus === 'completed' ? serverTimestamp() : null
    });
  };

  const completedCount = tasks.filter(t => t.status === 'completed' || t.status === 'verified').length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const [vocab, setVocab] = useState({ word: 'Zusammenhang', ipa: '/tsuˈzamənˌhaŋ/', translation: 'Connection' });
  const [isGeneratingVocab, setIsGeneratingVocab] = useState(false);

  const generateWord = async () => {
    setIsGeneratingVocab(true);
    try {
      const { generateNewVocabulary } = await import('../services/gemini');
      const newVocab = await generateNewVocabulary();
      setVocab(newVocab);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingVocab(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col gap-6">
      <div className="glass-panel p-6 flex-1 flex flex-col">
        <header className="flex justify-between items-center mb-6 text-xs font-bold uppercase tracking-widest">
          <span className="text-white/40">Daily Tasks</span>
          <span className="text-blue-400">{progress}% Done</span>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-10 opacity-20 text-xs uppercase tracking-tighter">
              No tasks assigned today.
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div 
                key={task.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => toggleTask(task)}
                className={`task-card cursor-pointer group ${task.status !== 'pending' ? 'completed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{task.title}</span>
                    <span className="text-[10px] opacity-70">{task.description || 'Practice session with Aris'}</span>
                  </div>
                  {task.status !== 'pending' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/20 group-hover:text-blue-500" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 rounded-xl border border-dashed border-white/10 text-center bg-white/[0.01]">
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase">
            <Clock className="w-3 h-3" />
            <span>Next AI Verification in 14:02</span>
          </div>
        </div>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass-panel p-5 h-48 flex flex-col justify-center items-center text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
          <Sparkles className="w-12 h-12 text-purple-400" />
        </div>
        
        <div className="z-10 w-full flex flex-col items-center">
          <div className="text-[10px] uppercase text-purple-400 font-bold mb-3 tracking-widest">Daily Vocabulary</div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={vocab.word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col items-center ${isGeneratingVocab ? 'blur-sm grayscale opacity-50' : ''} transition-all duration-300`}
            >
              <div className="text-3xl font-serif italic mb-1 text-white/90">{vocab.word}</div>
              <div className="text-xs text-white/50 font-mono mb-2">{vocab.ipa}</div>
              <div className="text-sm text-purple-300 font-light tracking-wide">{vocab.translation}</div>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={generateWord}
            disabled={isGeneratingVocab}
            className="mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 hover:border-purple-500/50 transition-all flex items-center gap-2 group/btn disabled:opacity-50"
          >
            {isGeneratingVocab ? (
              <Clock className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 group-hover/btn:text-purple-400 transition-colors" />
            )}
            <span>{isGeneratingVocab ? 'Generating...' : 'Generate New'}</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}

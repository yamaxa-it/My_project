import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Clock, Star } from 'lucide-react';
import { Task } from '../types';
import { translations, Language } from '../lib/translations';

interface HomeworkViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string, currentStatus: string) => void;
  lang: Language;
}

export default function HomeworkView({ tasks, onToggleTask, lang }: HomeworkViewProps) {
  const t = translations[lang];

  return (
    <div className="flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
      <div className="flex flex-col gap-4 md:gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">{t.homework}</h2>
            <p className="text-white/40 text-xs md:text-sm">Review and complete your personalized assignments.</p>
          </div>
          <div className="text-right self-end md:self-auto">
            <div className="text-xl md:text-2xl font-mono text-purple-400">{tasks.filter(t => t.status === 'completed').length}/{tasks.length}</div>
            <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/30">Completed Tasks</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 pb-10">
          {tasks.length === 0 ? (
            <div className="col-span-full py-16 md:py-20 text-center glass-panel">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-white/10 mx-auto mb-4" />
              <p className="text-xs md:text-sm text-white/30">No homework assigned yet. Chat with Aris to get some!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-panel p-4 md:p-6 border-l-4 ${
                  task.status === 'completed' ? 'border-l-green-500' : 'border-l-purple-500'
                } flex flex-col gap-3 md:gap-4 relative group`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-purple-400">
                      {task.type || 'General'}
                    </span>
                    <h3 className={`text-base md:text-lg font-bold ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => onToggleTask(task.id, task.status)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      task.status === 'completed' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-white/5 text-white/20 hover:bg-purple-500/20 hover:text-purple-400'
                    }`}
                  >
                    {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Clock className="w-5 h-5 md:w-6 md:h-6" />}
                  </button>
                </div>
                
                <p className="text-xs md:text-sm text-white/60 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                  {task.description}
                </p>

                <div className="flex items-center gap-4 mt-1 md:mt-2">
                   <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-mono text-white/30">
                     <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />
                     <span>XP: +50</span>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

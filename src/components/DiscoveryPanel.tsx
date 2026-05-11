import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { generateNewVocabulary } from '../services/gemini';
import { Language, translations } from '../lib/translations';

interface DiscoveryPanelProps {
  level: string;
  lang: Language;
}

export default function DiscoveryPanel({ level, lang }: DiscoveryPanelProps) {
  const t = translations[lang];
  const [vocab, setVocab] = useState({ word: 'Vorfreude', ipa: '/ˈfoːɐ̯ˌfʀɔɪ̯də/', translation: 'Anticipation / Joy' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);

  const videos = [
    {
      title: "Master Any Language with Spaced Repetition",
      duration: "12:45",
      id: "j_6D0-XvHyc",
      thumbnail: "https://img.youtube.com/vi/j_6D0-XvHyc/mqdefault.jpg",
      channel: "Language Mastery"
    },
    {
      title: "German Grammar for IELTS Prep",
      duration: "18:20",
      id: "jU-X8H7S3-M",
      thumbnail: "https://img.youtube.com/vi/jU-X8H7S3-M/mqdefault.jpg",
      channel: "Learn German With Anja"
    },
    {
      title: "Common Mistakes in English Professional Speaking",
      duration: "15:10",
      id: "9fS0L-D-u7Y",
      thumbnail: "https://img.youtube.com/vi/9fS0L-D-u7Y/mqdefault.jpg",
      channel: "English with Lucy"
    },
    {
      title: "IELTS Speaking: The Secret to Band 9",
      duration: "21:30",
      id: "sRFEVatR73g",
      thumbnail: "https://img.youtube.com/vi/sRFEVatR73g/mqdefault.jpg",
      channel: "IELTS Advantage"
    },
    {
      title: "Korean Grammar for Daily Conversation",
      duration: "14:45",
      id: "x_nPhVf4n-Y",
      thumbnail: "https://img.youtube.com/vi/x_nPhVf4n-Y/mqdefault.jpg",
      channel: "Talk To Me In Korean"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }, 1800000); // 30 minutes exactly
    return () => clearInterval(interval);
  }, [videos.length]);

  const handleGenVocab = async () => {
    setIsGenerating(true);
    try {
      const data = await generateNewVocabulary(level);
      if (data) setVocab(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentVideo = videos[activeVideo];

  return (
    <section className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto md:mx-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {/* Video Recommendation */}
        <div className="glass-panel p-5 flex flex-col gap-4 overflow-hidden group">
        <div className="flex justify-between items-center">
          <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Recommended for you</div>
          <div className="flex items-center gap-1 text-[10px] text-purple-400">
             <Clock className="w-3 h-3" />
             <span>Refreshes every 30m</span>
          </div>
        </div>

        <motion.div 
          layoutId="video-card"
          onClick={() => window.open(`https://www.youtube.com/watch?v=${currentVideo.id}`, '_blank')}
          className="relative rounded-2xl overflow-hidden aspect-video group/video cursor-pointer"
        >
          <img 
            src={currentVideo.thumbnail} 
            alt={currentVideo.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-110" 
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
             <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                <Play className="w-6 h-6 fill-current" />
             </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono">
            {currentVideo.duration}
          </div>
        </motion.div>

        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-sm line-clamp-1">{currentVideo.title}</h3>
          <p className="text-[10px] text-white/50">{currentVideo.channel}</p>
        </div>

        <button 
          onClick={() => window.open(`https://www.youtube.com/watch?v=${currentVideo.id}`, '_blank')}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all"
        >
          <Play className="w-3 h-3" />
          <span>Watch Now</span>
        </button>
      </div>

      {/* Level-based Vocabulary */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass-panel p-6 flex flex-col justify-center items-center text-center relative overflow-hidden flex-1 min-h-[220px]"
      >
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full" />
        
        <div className="z-10 w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[10px] uppercase text-purple-400 font-bold tracking-widest">{t.vocabulary}</span>
             <span className="bg-purple-500/20 text-purple-400 text-[8px] px-1.5 py-0.5 rounded-full font-bold">{level}</span>
          </div>
          
          <div>
            <div className={`flex flex-col items-center flex-1 py-4 ${isGenerating ? 'blur-sm grayscale opacity-50' : ''} transition-all duration-300`}>
              <div className="text-4xl font-serif italic mb-2 text-white/90 selection:bg-purple-500/30">{vocab.word}</div>
              <div className="text-xs text-white/40 font-mono mb-3 tracking-widest">{vocab.ipa}</div>
              <div className="text-base text-purple-200 font-light tracking-wide max-w-[200px] leading-snug">{vocab.translation}</div>
            </div>
          </div>

          <button 
            onClick={handleGenVocab}
            disabled={isGenerating}
            className="mt-6 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 hover:border-purple-500/50 transition-all flex items-center gap-2 group/btn disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 group-hover/btn:text-purple-400 transition-colors" />
            )}
            <span>{isGenerating ? 'Expanding...' : t.generate}</span>
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);
}

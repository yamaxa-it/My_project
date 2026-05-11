import { motion } from 'motion/react';
import { LogIn, Sparkles, Languages, Target, Clock, Instagram, Mail, ChevronRight } from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';

export default function LandingPage() {
  const features = [
    { 
      icon: <Languages className="w-6 h-6" />, 
      title: "Polyglot Master", 
      text: "Intelligence optimized for 5 major global languages." 
    },
    { 
      icon: <Target className="w-6 h-6" />, 
      title: "Exam Engine", 
      text: "Pass IELTS, TestDaF, and TOPIK with data-driven prep." 
    },
    { 
      icon: <Sparkles className="w-6 h-6" />, 
      title: "Context Memory", 
      text: "AI that evolves with your mistakes and celebrates your wins." 
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: "Dynamic Content", 
      text: "Curated learning artifacts rotating every 30 minutes." 
    },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black selection:bg-purple-500/30">
      {/* Immersive Background */}
      <div className="liquid-bg">
        <div className="liquid-blob top-[-10%] left-[-10%]" />
        <div className="liquid-blob bottom-[-10%] right-[-10%] shadow-indigo-500/10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center">
        {/* Floating Nav / Credit */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel py-2 px-6 mb-16 flex items-center gap-6 border-white/5 backdrop-blur-3xl shadow-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">v2.0 LIVE</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Designed by Saidmuhammad</span>
        </motion.div>

        {/* Hero Section */}
        <div className="max-w-5xl w-full text-center space-y-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-7xl md:text-[120px] font-extrabold tracking-tighter leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
              LEARN<br/>WITHOUT<br/>LIMITS.
            </h1>
            <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
              Experience <span className="text-white">LinguGlass</span> — the high-fidelity AI pedagogy 
              developed by <span className="text-purple-400">Saidmuhammad</span> for the next generation of polyglots.
            </p>
          </motion.div>

          {/* CTA Group */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={async () => {
                try {
                  await loginWithGoogle();
                } catch (error: any) {
                  if (error.code !== 'auth/popup-closed-by-user') {
                    console.error('Login error:', error);
                  }
                }
              }}
              className="bg-white text-black px-12 py-5 rounded-full font-bold flex items-center gap-4 group shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 transition-all duration-500"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="22" alt="G" />
              <span className="text-xs uppercase tracking-widest">Login with Intelligence</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mt-32 max-w-6xl">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass-card p-10 flex flex-col gap-6 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                <div className="text-[120px] font-black -translate-y-12 translate-x-12 select-none">0{i+1}</div>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 w-fit text-purple-400 group-hover:text-white group-hover:bg-purple-600 transition-all duration-500">
                {f.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-widest">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Footer */}
        <footer className="w-full mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left space-y-2 opacity-40">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/80">LinguGlass Core v2</h4>
            <p className="text-[10px] max-w-[300px]">Architected for stability and precision in language acquisition. Developed by Saidmuhammad.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/20">Contact Engineering</span>
              <a href="mailto:iskandarovsaidmuhammad2@gmail.com" className="flex items-center gap-3 text-xs text-white/60 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5"><Mail className="w-3 h-3" /></div>
                <span>iskandarovsaidmuhammad2@gmail.com</span>
              </a>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/20">Social Connection</span>
              <a href="https://www.instagram.com/1skandarov.s" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-white/60 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5"><Instagram className="w-3 h-3" /></div>
                <span>@1skandarov.s</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

import { 
  LogOut, 
  LayoutDashboard, 
  MessageSquare, 
  ListTodo, 
  Settings, 
  Languages,
  Sparkles,
  Compass
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Language, translations } from '../lib/translations';

export type ViewType = 'dashboard' | 'chat' | 'homework' | 'settings' | 'discovery';

interface SidebarProps {
  photoURL?: string;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  lang: Language;
}

export default function Sidebar({ photoURL, activeView, onViewChange, lang }: SidebarProps) {
  const t = translations[lang];

  const menuItems = [
    { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: t.dashboard, color: 'text-purple-400' },
    { id: 'chat' as ViewType, icon: MessageSquare, label: t.chat, color: 'text-blue-400' },
    { id: 'discovery' as ViewType, icon: Compass, label: t.discovery, color: 'text-orange-400' },
    { id: 'homework' as ViewType, icon: ListTodo, label: t.homework, color: 'text-emerald-400', badge: true },
    { id: 'settings' as ViewType, icon: Settings, label: t.settings, color: 'text-white/60' },
  ];

  return (
    <aside id="main-sidebar" className="glass-panel w-full md:w-20 h-20 md:h-full flex flex-row md:flex-col items-center justify-between md:justify-start py-4 md:py-10 px-6 md:px-0 border-b md:border-b-0 md:border-r border-white/10 relative z-30 shrink-0">
      <motion.div 
        whileHover={{ rotate: 180, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] shrink-0 cursor-pointer"
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>

      <nav className="flex flex-row md:flex-col gap-6 md:gap-10 flex-1 items-center justify-center">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`relative group p-3 rounded-2xl transition-all duration-500 ${
              activeView === item.id 
                ? 'bg-white/10 text-white scale-110' 
                : 'text-white/20 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-6 h-6 ${activeView === item.id ? item.color : ''} transition-colors duration-500`} />
            
            {item.badge && activeView !== item.id && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            )}

            <div className="absolute left-1/2 -translate-x-1/2 -top-14 md:left-full md:ml-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 px-4 py-2 bg-white text-black text-[9px] uppercase font-black tracking-[0.2em] rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 whitespace-nowrap shadow-2xl z-50 hidden md:block">
              {item.label}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 hidden md:block" />
            </div>
          </button>
        ))}
      </nav>

      <div className="flex flex-row md:flex-col gap-6 items-center shrink-0">
        <button 
          onClick={() => auth.signOut()}
          className="p-3 rounded-2xl hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all duration-300 active:scale-90"
          title="Sign Out"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
}

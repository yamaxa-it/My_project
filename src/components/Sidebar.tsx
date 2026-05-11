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
    { id: 'discovery' as ViewType, icon: Compass, label: t.discovery, color: 'text-orange-400' },
    { id: 'chat' as ViewType, icon: MessageSquare, label: t.chat, color: 'text-blue-400' },
    { id: 'homework' as ViewType, icon: ListTodo, label: t.homework, color: 'text-green-400', badge: true },
    { id: 'settings' as ViewType, icon: Settings, label: t.settings, color: 'text-white/60' },
  ];

  return (
    <aside id="main-sidebar" className="glass-panel w-full md:w-20 h-16 md:h-full flex flex-row md:flex-col items-center justify-between md:justify-start py-2 md:py-8 px-6 md:px-0 gap-0 md:gap-10 border-b md:border-b-0 md:border-r border-white/5 relative z-20 shrink-0">
      <motion.div 
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0"
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </motion.div>

      <nav className="flex flex-row md:flex-col gap-4 md:gap-8 flex-1 items-center justify-center">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`relative group p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
              activeView === item.id 
                ? 'bg-white/10 text-white shadow-xl shadow-black/20' 
                : 'text-white/30 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${activeView === item.id ? item.color : ''}`} />
            
            {item.badge && activeView !== item.id && (
              <span className="absolute top-1 md:top-2 right-1 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-pulse" />
            )}

            {/* Tooltip (hidden on mobile) */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 md:left-full md:ml-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 px-3 py-1.5 bg-white text-black text-[10px] uppercase font-bold tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all whitespace-nowrap shadow-2xl z-50 hidden md:block">
              {item.label}
            </div>
            
            {activeView === item.id && (
              <div className="absolute -bottom-1 md:-left-3 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-8 md:w-1.5 h-1 md:h-8 bg-purple-500 rounded-t-full md:rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="flex flex-row md:flex-col gap-4 md:gap-6 items-center shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border-2 border-white/10 p-0.5 group cursor-pointer hover:border-purple-500 transition-colors">
          <img 
            src={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.email}`} 
            alt="User" 
            className="w-full h-full rounded-md md:rounded-lg object-cover"
          />
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="p-2 rounded-xl hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all group relative"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

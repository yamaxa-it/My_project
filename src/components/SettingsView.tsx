import { motion } from 'motion/react';
import { Globe, Palette, Shield, User, ChevronRight } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface SettingsViewProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  user: any;
}

export default function SettingsView({ currentLang, onLangChange, user }: SettingsViewProps) {
  const t = translations[currentLang];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uz', label: 'Oʻzbekcha', flag: '🇺🇿' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full py-8">
      <div className="flex flex-col gap-10">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">{t.settings}</h2>
          <p className="text-white/40 text-sm">Manage your profile and application preferences.</p>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-2">
            <Globe className="w-3 h-3" />
            <span>{t.langSelect}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLangChange(lang.code)}
                className={`flex items-center justify-between p-4 rounded-2xl glass-panel border transition-all ${
                  currentLang === lang.code 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium text-sm">{lang.label}</span>
                </div>
                {currentLang === lang.code && <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2">
            <User className="w-3 h-3" />
            <span>Personal Info</span>
          </div>
          <div className="glass-panel p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Name</span>
              <span className="text-sm font-bold">{user.name || user.displayName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Email</span>
              <span className="text-sm font-bold">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/50">Age</span>
              <span className="text-sm font-bold">{user.age || '—'}</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 opacity-50 cursor-not-allowed">
           <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2">
            <Palette className="w-3 h-3" />
            <span>Appearance (Pro)</span>
          </div>
          <div className="glass-panel p-4 flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-sm font-bold tracking-tight">Theme Customization</span>
               <span className="text-[10px] text-white/40">Unlock custom glass shaders and neon accents.</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Sidebar, { ViewType } from './Sidebar';
import Chat from './Chat';
import DiscoveryPanel from './DiscoveryPanel';
import HomeworkView from './HomeworkView';
import SettingsView from './SettingsView';
import OnboardingModal from './OnboardingModal';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Trophy } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [tasks, setTasks] = useState<any[]>([]);

  const t = translations[lang];

  useEffect(() => {
    const fetchProfile = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          englishLevel: 'A1',
          germanLevel: 'A1',
          onboarded: false,
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
        setShowOnboarding(true);

        // Add initial diagnostic task
        await addDoc(collection(db, 'users', user.uid, 'tasks'), {
          title: 'Initial Diagnostic',
          description: 'Determine your proficiency level with the Professor',
          status: 'pending',
          type: 'diagnostic',
          createdAt: serverTimestamp(),
        });
      } else {
        const data = userSnap.data();
        setProfile(data);
        if (!data.onboarded) {
          setShowOnboarding(true);
        }
      }
    };

    fetchProfile();

    // Listen for real-time task updates
    const unsubTasks = onSnapshot(collection(db, 'users', user.uid, 'tasks'), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubTasks();
  }, [user]);

  const handleOnboardingComplete = (name: string, age: number) => {
    setProfile((prev: any) => ({ ...prev, name, age, onboarded: true }));
    setShowOnboarding(false);
    
    // Add personalized welcome message
    addDoc(collection(db, 'users', user.uid, 'chats', 'default', 'messages'), {
      role: 'model',
      content: `Здравствуйте, ${name}! Я — Профессор Лингвистики. Начнем наше обучение. Прежде всего, мне нужно уточнить два момента:

1. Какой именно язык из моего арсенала (узбекский, русский, английский, немецкий, корейский) вы хотите изучать?
2. На каком языке вам будет удобнее получать объяснения и инструкции?`,
      timestamp: serverTimestamp(),
    });
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    await updateDoc(taskRef, {
      status: currentStatus === 'completed' ? 'pending' : 'completed',
      updatedAt: serverTimestamp(),
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden relative">
            <div className="flex-[1.5] md:flex-[1.5] flex h-full md:h-full min-h-0 overflow-hidden">
              <Chat userId={user.uid} name={profile?.name} lang={lang} />
            </div>
            <div className="hidden md:flex md:flex-[0.8] lg:flex-1 h-full overflow-y-auto md:overflow-visible pb-20 md:pb-0">
              <DiscoveryPanel level={profile?.germanLevel || 'A1'} lang={lang} />
            </div>
            
            {/* Minimal Dashboard Credit */}
            <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
              <span className="text-[8px] uppercase tracking-widest text-white/50">Developed by Saidmuhammad</span>
              <div className="flex gap-2">
                <a href="https://www.instagram.com/1skandarov.s" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>
        );
      case 'discovery':
        return (
          <div className="flex-1 overflow-y-auto pb-10">
            <DiscoveryPanel level={profile?.germanLevel || 'A1'} lang={lang} />
          </div>
        );
      case 'chat':
        return (
          <div className="flex-1 overflow-hidden">
            <Chat userId={user.uid} name={profile?.name} lang={lang} />
          </div>
        );
      case 'homework':
        return (
          <HomeworkView tasks={tasks} onToggleTask={toggleTask} lang={lang} />
        );
      case 'settings':
        return (
          <SettingsView 
            currentLang={lang} 
            onLangChange={setLang} 
            user={{...profile, email: user.email}} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full p-4 md:p-8 gap-4 md:gap-8 overflow-hidden relative">
      
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal 
            userId={user.uid} 
            onComplete={handleOnboardingComplete} 
          />
        )}
      </AnimatePresence>
      
      <Sidebar 
        photoURL={user.photoURL || undefined} 
        activeView={activeView}
        onViewChange={setActiveView}
        lang={lang}
      />

      <main className="flex-1 flex flex-col gap-6 md:gap-10 overflow-hidden mt-4 md:mt-0">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 gap-6 shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black tracking-[0.3em] text-purple-400 uppercase">
                CORE v2.0
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] text-white/40 font-mono tracking-widest">{t.activeSession}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter leading-tight text-white">
              {t.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{t.professor}</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <motion.div 
              whileHover={{ y: -2, scale: 1.02 }}
              className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-2 pr-6 rounded-[2rem] backdrop-blur-3xl group transition-all hover:bg-white/[0.05]"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-black shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
                {profile?.name?.charAt(0) || 'U'}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white">{profile?.name || 'Academic'}</span>
                <span className="text-[10px] text-white/30 font-medium tracking-wider">{user.email}</span>
              </div>
            </motion.div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden glass-panel border-white/5 min-h-0 bg-white/[0.01]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

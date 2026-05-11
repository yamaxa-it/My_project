import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Calendar, ArrowRight } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface OnboardingModalProps {
  userId: string;
  onComplete: (name: string, age: number) => void;
}

export default function OnboardingModal({ userId, onComplete }: OnboardingModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        name: name.trim(),
        age: parseInt(age),
        onboarded: true,
        updatedAt: serverTimestamp(),
      });
      onComplete(name.trim(), parseInt(age));
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel max-w-md w-full p-8 flex flex-col gap-8 shadow-2xl shadow-purple-500/10"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 mx-auto mb-4 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-light tracking-tight">Welcome to <span className="font-bold text-purple-400">LinguGlass</span></h2>
          <p className="text-sm text-white/50 mt-2">Let's personalize your learning experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Your Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should I call you?"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Your Age</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="number"
                required
                min="5"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="How old are you?"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim() || !age || isSubmitting}
            className="mt-4 bg-white text-black font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 group hover:bg-purple-400 transition-all disabled:opacity-50"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

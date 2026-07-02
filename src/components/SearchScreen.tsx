import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode } from '../types';
import { Search, Sparkles, Swords, BrainCircuit, Moon, Menu, X, Clock, ShieldAlert } from 'lucide-react';
import { PolicyScreen } from './PolicyScreen';

interface Props {
  key?: string;
  onStart: (query: string, mode: GameMode) => void;
  isLockedOut?: boolean;
  initialQuery?: string;
  initialMode?: GameMode;
  error?: string | null;
}

function TimeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      
      const target = new Date();
      target.setHours(24, 0, 0, 0); // Next midnight
      
      const diff = target.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-10 text-slate-400 hover:text-white transition-colors p-2 bg-slate-900/50 rounded-full backdrop-blur-md border border-slate-800"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl flex flex-col items-center text-center space-y-8 md:space-y-10 py-8"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-800 shadow-xl flex-shrink-0">
                <Clock className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
              </div>
              
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">Kalan Zaman</h3>
              
              {timeLeft ? (
                <div className="flex gap-4 md:gap-8 bg-slate-900/50 p-6 md:p-10 rounded-[2rem] md:rounded-full border border-slate-800 w-full justify-center shadow-2xl flex-wrap md:flex-nowrap">
                  <div className="flex flex-col items-center w-20 md:w-28">
                    <span className="text-5xl md:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 drop-shadow-sm">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs md:text-sm font-bold tracking-widest text-slate-500 mt-2 md:mt-3">SAAT</span>
                  </div>
                  <span className="text-5xl md:text-7xl font-mono font-black text-slate-700 animate-pulse mt-1 md:mt-2 hidden md:block">:</span>
                  <div className="flex flex-col items-center w-20 md:w-28">
                    <span className="text-5xl md:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-300 to-fuchsia-600 drop-shadow-sm">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs md:text-sm font-bold tracking-widest text-slate-500 mt-2 md:mt-3">DAKİKA</span>
                  </div>
                  <span className="text-5xl md:text-7xl font-mono font-black text-slate-700 animate-pulse mt-1 md:mt-2 hidden md:block">:</span>
                  <div className="flex flex-col items-center w-20 md:w-28 mt-4 md:mt-0">
                    <span className="text-5xl md:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-orange-600 drop-shadow-sm">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs md:text-sm font-bold tracking-widest text-slate-500 mt-2 md:mt-3">SANİYE</span>
                  </div>
                </div>
              ) : (
                <div className="text-xl md:text-2xl font-mono text-slate-500 py-12">Zaman hesaplanıyor...</div>
              )}
              
              <div className="text-slate-400 text-base md:text-xl leading-relaxed text-center max-w-2xl mt-6 font-light px-4">
                <p>
                  Sistemlerimiz dijital sağlığınızı korumak için gece yarısı <strong className="text-fuchsia-400 font-bold">(00:00)</strong> itibarıyla zorunlu uyku moduna geçecektir.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SearchScreen({ onStart, isLockedOut = false, initialQuery = '', initialMode = 'classic', error = null }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<GameMode>(initialMode as GameMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    onStart(query, mode);
  };

  return (
    <>
      <div className="fixed top-6 left-6 md:top-8 md:left-8 z-40">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center justify-center p-2 text-slate-400 hover:text-white transition-colors group"
        >
          <Menu className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 cursor-pointer"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-slate-900 border-r border-slate-800 z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-2 text-xl font-black">
                  <Sparkles className="w-6 h-6 text-fuchsia-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
                    RealmsMenu
                  </span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsTimeModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center font-medium">
                    <Clock className="w-5 h-5 mr-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                    Ne Kadar Kaldı?
                  </div>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsPolicyModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center font-medium">
                    <ShieldAlert className="w-5 h-5 mr-3 text-rose-500 group-hover:scale-110 transition-transform" />
                    Neden Kısıtlamalı?
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <TimeModal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} />
      
      <AnimatePresence>
        {isPolicyModalOpen && (
          <PolicyScreen onClose={() => setIsPolicyModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLockedOut ? (
          <motion.div 
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-black text-white"
          >
            <div className="absolute inset-0 bg-black -z-10"></div>
            
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
              className="w-full text-center py-12 space-y-8"
            >
              <Moon className="w-20 h-20 text-slate-500 mx-auto opacity-70" />
              <h3 className="text-4xl md:text-5xl font-light text-slate-300 tracking-wide">
                RealmsQuiz Şu An Uygun Değil.
              </h3>
              <p className="text-slate-500 text-xl font-light">
                Yarın sabah yeni maceralarda görüşmek üzere.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10"></div>
            
            <div className="w-full max-w-md flex flex-col items-center space-y-8">
              <div className="text-center space-y-2">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="flex items-center justify-center space-x-3 text-4xl md:text-5xl font-black tracking-tight"
                >
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-fuchsia-400" />
                  <div>
                    <span className="text-fuchsia-400">Realms</span>
                    <span className="text-cyan-400">Quiz</span>
                  </div>
                </motion.div>
                <p className="text-sm md:text-base text-slate-400">Sonsuz bilgi alemlerini keşfet.</p>
              </div>

              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="w-full space-y-5"
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 text-center"
                    >
                      <p className="text-red-400 font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group shadow-[0_0_20px_rgba(192,132,252,0.05)] rounded-2xl">
                  <div className="relative flex items-center bg-[#0B101D] border border-slate-800 rounded-2xl p-1.5 h-16">
                    <Search className="w-5 h-5 text-slate-500 ml-4 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Herhangi bir konu..." 
                      className="w-full bg-transparent border-none outline-none text-base px-4 py-2 text-white placeholder-slate-600"
                    />
                    <button 
                      type="submit"
                      className="px-6 h-full bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex-shrink-0 text-sm"
                    >
                      Başla
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('classic')}
                    className={`w-full flex items-center p-4 rounded-2xl border transition-all ${mode === 'classic' ? 'border-cyan-400 bg-cyan-400/5' : 'border-slate-800/60 bg-transparent hover:border-slate-700'}`}
                  >
                    <BrainCircuit className={`w-6 h-6 mr-4 ml-2 ${mode === 'classic' ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div className="text-left">
                      <div className={`font-bold text-lg ${mode === 'classic' ? 'text-cyan-400' : 'text-slate-200'}`}>Klasik Soru & Cevap</div>
                      <div className={`text-xs mt-0.5 ${mode === 'classic' ? 'text-cyan-400/70' : 'text-slate-500'}`}>4 seçenek, 1 doğru</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('this-or-that')}
                    className={`w-full flex items-center p-4 rounded-2xl border transition-all ${mode === 'this-or-that' ? 'border-fuchsia-400 bg-fuchsia-400/5' : 'border-slate-800/60 bg-transparent hover:border-slate-700'}`}
                  >
                    <Swords className={`w-6 h-6 mr-4 ml-2 ${mode === 'this-or-that' ? 'text-fuchsia-400' : 'text-slate-500'}`} />
                    <div className="text-left">
                      <div className={`font-bold text-lg ${mode === 'this-or-that' ? 'text-fuchsia-400' : 'text-slate-200'}`}>O Mu, Bu Mu?</div>
                      <div className={`text-xs mt-0.5 ${mode === 'this-or-that' ? 'text-fuchsia-400/70' : 'text-slate-500'}`}>Turnuva usulü eleme</div>
                    </div>
                  </button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

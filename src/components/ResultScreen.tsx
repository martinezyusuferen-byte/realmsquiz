import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { GameState } from '../types';
import { Trophy, RotateCcw, Flame } from 'lucide-react';

interface Props {
  key?: string;
  state: GameState;
  onPlayAgain: () => void;
}

export function ResultScreen({ state, onPlayAgain }: Props) {
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-slate-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-950 to-slate-950 -z-10"></div>
      
      <motion.div 
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-slate-900/80 border border-slate-700/50 p-8 md:p-12 rounded-3xl backdrop-blur-md text-center max-w-lg w-full shadow-2xl"
      >
        <motion.div 
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-24 h-24 bg-gradient-to-tr from-fuchsia-500 to-cyan-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(217,70,239,0.3)]"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-black mb-2 text-white">OYUN BİTTİ</h2>
        <p className="text-slate-400 mb-8">{state.quiz?.title}</p>
        
        {state.mode === 'this-or-that' ? (
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.1)] mb-10">
            <div className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Nihai Kazanan</div>
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-md leading-tight">
              {state.tournamentWinner}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm font-medium mb-1">FİNAL SKORU</div>
              <div className="text-3xl font-black text-cyan-400 font-mono">{state.score.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="text-slate-400 text-sm font-medium mb-1 flex items-center justify-center gap-1">
                MAKSİMUM KOMBO
              </div>
              <div className="text-3xl font-black text-orange-400 flex items-center justify-center gap-2">
                <Flame className="w-6 h-6 fill-orange-400" />
                {state.maxCombo}
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>TEKRAR OYNA</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

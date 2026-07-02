import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, EyeOff, Heart } from 'lucide-react';

interface Props {
  onProceed: () => void;
  onCancel: () => void;
}

export function LateNightWarningScreen({ onProceed, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [isThanking, setIsThanking] = useState(false);
  const [thankStep, setThankStep] = useState(0);
  const timeString = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    if (isThanking) {
      const timers = [
        setTimeout(() => {
          onCancel();
        }, 3000)
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      const timers = [
        setTimeout(() => setStep(1), 3000),
        setTimeout(() => setStep(2), 6500),
        setTimeout(() => setStep(3), 10000),
        setTimeout(() => setStep(4), 14000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isThanking, onCancel]);

  const handleRest = () => {
    setIsThanking(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-slate-950 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950 -z-10"></div>
      
      <AnimatePresence mode="wait">
        {!isThanking && step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <Moon className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h2 className="text-4xl md:text-6xl font-mono text-slate-400">Saat {timeString}...</h2>
          </motion.div>
        )}

        {!isThanking && step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-200">Bu saatte Realm oluşturulamaz.</h2>
          </motion.div>
        )}

        {!isThanking && step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="text-center max-w-2xl px-4"
          >
            <EyeOff className="w-16 h-16 text-cyan-500/50 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-medium text-slate-300 leading-relaxed">
              Göz sağlığın ve zihinsel dinlenmen,<br/>şu an her türlü Realm'den daha önemli.
            </h2>
          </motion.div>
        )}

        {!isThanking && step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="text-center max-w-2xl px-4"
          >
            <h2 className="text-2xl md:text-3xl font-light text-slate-400 leading-relaxed">
              Yarın sabah zinde bir zihinle,<br/>çok daha güçlü boyutlar keşfedebilirsin.
            </h2>
          </motion.div>
        )}

        {!isThanking && step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-medium text-slate-200">
              Şimdi ekranı kapatma vakti.
            </h2>
            <div className="flex flex-col items-center justify-center gap-6 mt-8">
              <button 
                onClick={handleRest}
                className="px-10 py-5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-colors w-full sm:w-auto text-lg shadow-lg"
              >
                Anladım, Dinlenmeye Gidiyorum
              </button>
            </div>
          </motion.div>
        )}

        {isThanking && thankStep === 0 && (
           <motion.div 
           key="thank0"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, filter: "blur(10px)" }}
           transition={{ duration: 1 }}
           className="text-center"
         >
           <Moon className="w-16 h-16 text-indigo-400 mx-auto mb-6 opacity-80" />
           <h2 className="text-4xl md:text-5xl font-light text-slate-200 tracking-wide">İyi geceler.</h2>
         </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

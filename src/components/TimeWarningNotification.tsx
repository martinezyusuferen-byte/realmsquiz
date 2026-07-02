import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, AlertTriangle } from 'lucide-react';

const playAlertSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // A soothing C Major 9 arpeggio: C4, E4, G4, B4, D5 (5 notes)
    // We'll layer 2 oscillators per note (Sine + Triangle) + 1 high sparkle = 11 oscillators total.
    const notes = [261.63, 329.63, 392.00, 493.88, 587.33];
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const t = startTime + index * 0.15; // roll the chord slowly
      
      // Layer 1: Soft Electric Piano / Marimba feel (Sine)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.value = freq;
      gain1.gain.setValueAtTime(0, t);
      gain1.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 2.5);

      // Layer 2: Warm Ambient Pad (Triangle, octave lower)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 0.5;
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.08, t + 0.4);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 3.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 3.5);
    });
    
    // The 11th oscillator: A gentle high sparkle on the last note for magic effect
    const sparkle = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkle.type = 'sine';
    sparkle.frequency.value = 587.33 * 2; // D6
    sparkleGain.gain.setValueAtTime(0, startTime + 0.6);
    sparkleGain.gain.linearRampToValueAtTime(0.04, startTime + 0.65);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, startTime + 3.0);
    sparkle.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkle.start(startTime + 0.6);
    sparkle.stop(startTime + 3.0);
    
  } catch (e) {
    console.warn('Audio playback prevented by browser policy');
  }
};

export function TimeWarningNotification() {
  const [notification, setNotification] = useState<{ type: 'closing' | 'opening', message: string, title: string } | null>(null);
  const lastMinuteNotified = useRef<number | null>(null);
  const hasShownInitialWarning = useRef<boolean>(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Opening logic (00:00 - 06:00)
      if (hours >= 0 && hours < 6) {
        const isOpening = hours === 5 && minutes >= 51;
        if (isOpening) {
           const minsLeft = 60 - minutes;
           if (lastMinuteNotified.current !== minsLeft) {
             lastMinuteNotified.current = minsLeft;
             setNotification({ 
               type: 'opening', 
               title: 'Uyanış Yakın', 
               message: `Şafak söküyor... Boyutların açılmasına son ${minsLeft} dakika!` 
             });
             playAlertSound();
             setTimeout(() => setNotification(null), 6000);
           }
        }
        return;
      }

      // Closing logic (18:00 - 23:59)
      if (hours >= 18 && hours < 24) {
        const target = new Date();
        target.setHours(24, 0, 0, 0);
        const diff = target.getTime() - now.getTime();
        const totalMinutesLeft = Math.floor(diff / 1000 / 60);
        
        const hLeft = Math.floor(totalMinutesLeft / 60);
        const mLeft = totalMinutesLeft % 60;

        // Milestones to trigger the notification
        const triggerMinutes = [240, 120, 60, 45, 30, 15, 10, 5, 3, 2, 1];
        
        let shouldNotify = false;

        if (triggerMinutes.includes(totalMinutesLeft) && lastMinuteNotified.current !== totalMinutesLeft) {
          shouldNotify = true;
        }

        if (!hasShownInitialWarning.current) {
          shouldNotify = true;
          hasShownInitialWarning.current = true;
        }

        if (shouldNotify) {
          lastMinuteNotified.current = totalMinutesLeft;

          let timeStr = "";
          if (hLeft > 0) timeStr += `${hLeft} saat `;
          if (mLeft > 0 || hLeft === 0) timeStr += `${mLeft} dakika`;
          timeStr = timeStr.trim();

          const message = `Zihninizi dinlendirmek ve yarına enerji toplamak için ${timeStr} sonra bugünün serüvenine ara vereceğiz.`;

          setNotification({ 
            type: 'closing', 
            title: 'Dinlenme Vakti', 
            message 
          });
          playAlertSound();

          // Hide after 10 seconds for longer reading time
          setTimeout(() => {
            setNotification(null);
          }, 10000);
        }
      } else {
        lastMinuteNotified.current = null;
        hasShownInitialWarning.current = false;
      }
    };

    const interval = setInterval(checkTime, 1000);
    // Trigger initial check shortly after mount
    const initialTimeout = setTimeout(checkTime, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] max-w-sm md:max-w-md ${
            notification.type === 'closing' 
              ? 'bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800' 
              : 'bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white'
          }`}
        >
           <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
             notification.type === 'closing' ? 'bg-indigo-50' : 'bg-slate-800'
           }`}>
             {notification.type === 'closing' ? (
                <Clock className="w-6 h-6 text-indigo-500" />
             ) : (
                <AlertTriangle className="w-6 h-6 text-cyan-400" />
             )}
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${notification.type === 'closing' ? 'bg-indigo-400' : 'bg-cyan-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${notification.type === 'closing' ? 'bg-indigo-500' : 'bg-cyan-500'}`}></span>
             </span>
           </div>
           <div className="pr-2">
             <h4 className={`font-bold uppercase tracking-wider text-xs mb-1 ${notification.type === 'closing' ? 'text-indigo-600' : 'text-cyan-400'}`}>
               {notification.title}
             </h4>
             <p className={`text-sm font-medium leading-relaxed ${notification.type === 'closing' ? 'text-slate-600' : 'text-slate-200'}`}>
               {notification.message}
             </p>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

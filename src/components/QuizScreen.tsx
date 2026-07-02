import { motion, AnimatePresence } from 'motion/react';
import { GameState } from '../types';
import { getRealmBackground } from '../lib/realms';
import { Flame, CheckCircle2, XCircle, ArrowRight, Swords } from 'lucide-react';

interface Props {
  key?: string;
  state: GameState;
  onAnswer: (answer: string) => void;
  onCheck: () => void;
  onNext: () => void;
}

export function QuizScreen({ state, onAnswer, onCheck, onNext }: Props) {
  if (!state.quiz) return null;

  if (state.mode === 'this-or-that') {
    const matchup = state.tournamentCurrentMatchup;
    if (!matchup) return null;

    const totalInRound = state.tournamentRoundItems.length + state.tournamentNextRoundItems.length + 2;
    let roundName = "Turnuva";
    if (totalInRound === 16) roundName = "Son 16";
    else if (totalInRound === 8) roundName = "Çeyrek Final";
    else if (totalInRound === 4) roundName = "Yarı Final";
    else if (totalInRound === 2) roundName = "BÜYÜK FİNAL";

    const matchesPlayedInRound = state.tournamentNextRoundItems.length;
    const totalMatchesInRound = totalInRound / 2;
    const progress = (matchesPlayedInRound / totalMatchesInRound) * 100;
    const isFinalBoss = totalInRound === 2;

    const bgStyle = {
      backgroundImage: getRealmBackground(isFinalBoss ? 9 : matchesPlayedInRound),
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };

    return (
      <motion.div 
        key={`tournament-${roundName}-${matchesPlayedInRound}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen flex flex-col relative transition-all duration-1000 ${isFinalBoss ? 'bg-red-950' : 'bg-slate-950'}`}
        style={bgStyle}
      >
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 flex flex-col h-full min-h-screen p-4 md:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-sm text-slate-400 block font-medium uppercase tracking-widest">{state.quiz.title}</span>
              <span className="text-2xl font-bold text-white">{roundName}</span>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400 font-medium mb-2">
                EŞLEŞME {matchesPlayedInRound + 1} / {totalMatchesInRound}
              </div>
              <div className="w-32 md:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                  initial={{ width: `${progress}%` }}
                  animate={{ width: `${((matchesPlayedInRound + 1) / totalMatchesInRound) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Matchup Area */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 pb-12">
            {isFinalBoss && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
                transition={{ y: { repeat: Infinity, duration: 2 } }}
                className="text-red-500 font-black text-3xl md:text-5xl tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                BÜYÜK FİNAL
              </motion.div>
            )}

            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-3xl md:text-5xl font-bold text-center leading-tight max-w-4xl drop-shadow-lg ${isFinalBoss ? 'text-red-50' : 'text-white'}`}
            >
              Hangisini seçiyorsun?
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl h-auto md:h-80 relative">
              {matchup.map((item, idx) => (
                <motion.button
                  key={item}
                  initial={{ x: idx === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAnswer(item)}
                  className={`flex-1 relative overflow-hidden group rounded-3xl border-2 border-slate-600 hover:border-fuchsia-500 bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 min-h-[160px] transition-all shadow-xl hover:shadow-[0_0_40px_rgba(217,70,239,0.3)] text-left`}
                >
                  <h3 className="text-2xl md:text-4xl font-bold text-center text-white drop-shadow-md z-10 leading-tight">
                    {item}
                  </h3>
                </motion.button>
              ))}

              {/* VS Badge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-slate-900 border-4 border-slate-700 rounded-full shadow-2xl">
                <span className="text-xl md:text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-slate-300 to-slate-500">
                  VS
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = state.quiz.questions?.[state.currentQuestionIndex];
  if (!currentQ) return null;

  const isFinalBoss = state.currentQuestionIndex === state.quiz.questions.length - 1;
  const progress = ((state.currentQuestionIndex) / state.quiz.questions.length) * 100;
  
  const bgStyle = {
    backgroundImage: getRealmBackground(state.currentQuestionIndex),
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <motion.div 
      key={`q-${state.currentQuestionIndex}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col relative transition-all duration-1000"
      style={bgStyle}
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 backdrop-blur-md">
              <span className="text-sm text-slate-400 block font-medium">SKOR</span>
              <span className="text-2xl font-bold font-mono text-white">{state.score.toLocaleString()}</span>
            </div>
            {state.combo > 1 && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                key={`combo-${state.combo}`}
                className="flex items-center space-x-1 text-orange-500 font-black text-2xl"
              >
                <Flame className="w-6 h-6 fill-orange-500" />
                <span>x{state.combo}</span>
              </motion.div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-slate-400 font-medium mb-2">
              SEVİYE {state.currentQuestionIndex + 1} / {state.quiz.questions.length}
            </div>
            <div className="w-32 md:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                initial={{ width: `${((state.currentQuestionIndex-1) / state.quiz.questions.length) * 100}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          {isFinalBoss && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
              transition={{ y: { repeat: Infinity, duration: 2 } }}
              className="text-red-500 font-black text-3xl md:text-5xl tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            >
              BÜYÜK FİNAL
            </motion.div>
          )}
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-3xl md:text-5xl font-bold text-center leading-tight max-w-4xl drop-shadow-lg ${isFinalBoss ? 'text-red-50' : 'text-white'}`}
          >
            {currentQ.text}
          </motion.h2>

          <div className={`grid gap-4 w-full max-w-3xl ${currentQ.options.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
            {currentQ.options.map((opt, i) => {
              const isSelected = state.selectedAnswer === opt;
              const isCorrect = opt === currentQ.correctAnswer;
              
              let btnClass = "bg-slate-800/80 border-slate-600 hover:bg-slate-700 text-white";
              
              if (state.isAnswerChecked) {
                if (state.mode === 'this-or-that') {
                  if (isSelected) {
                    btnClass = "bg-fuchsia-500/40 border-fuchsia-500 text-fuchsia-50 shadow-[0_0_15px_rgba(217,70,239,0.3)]";
                  } else {
                    btnClass = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
                  }
                } else {
                  if (isCorrect) {
                    btnClass = "bg-green-500/20 border-green-500 text-green-100";
                  } else if (isSelected && !isCorrect) {
                    btnClass = "bg-red-500/20 border-red-500 text-red-100";
                  } else {
                    btnClass = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
                  }
                }
              } else if (isSelected) {
                btnClass = "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.3)]";
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!state.isAnswerChecked ? { scale: 1.02 } : {}}
                  whileTap={!state.isAnswerChecked ? { scale: 0.98 } : {}}
                  onClick={() => onAnswer(opt)}
                  disabled={state.isAnswerChecked}
                  className={`relative overflow-hidden p-6 rounded-2xl border-2 text-lg md:text-xl font-medium transition-all text-left ${btnClass} backdrop-blur-md`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {state.isAnswerChecked && state.mode !== 'this-or-that' && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                    {state.isAnswerChecked && state.mode !== 'this-or-that' && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {state.selectedAnswer && !state.isAnswerChecked && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <button
                  onClick={onCheck}
                  className="px-12 py-4 bg-white text-slate-950 font-black rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  KARARIM KESİN
                </button>
              </motion.div>
            )}

            {state.isAnswerChecked && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-between bg-slate-900/90 border border-slate-700 p-6 rounded-2xl backdrop-blur-md"
              >
                <div className="flex-1 mb-4 md:mb-0 md:mr-6 text-center md:text-left">
                  <div className={`font-black text-xl mb-2 ${state.mode === 'this-or-that' ? 'text-fuchsia-400' : (state.selectedAnswer === currentQ.correctAnswer ? 'text-green-400' : 'text-red-400')}`}>
                    {state.mode === 'this-or-that' ? 'SEÇİM ONAYLANDI' : (state.selectedAnswer === currentQ.correctAnswer ? 'DOĞRU!' : 'YANLIŞ!')}
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
                <button
                  onClick={onNext}
                  className="px-8 py-4 flex items-center bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
                >
                  {isFinalBoss ? 'SONUÇLARI GÖR' : 'SIRADAKİ SORU'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

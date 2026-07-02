/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import fpPromise from '@fingerprintjs/fingerprintjs';
import { GameState, GameMode, QuizData } from './types';
import { SearchScreen } from './components/SearchScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LateNightWarningScreen } from './components/LateNightWarningScreen';
import { TimeWarningNotification } from './components/TimeWarningNotification';
import { audio } from './lib/audio';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedLockout = localStorage.getItem('realmsquiz_lockout');
    let isLockedOut = false;
    
    if (savedLockout) {
      const lockoutDate = new Date(parseInt(savedLockout, 10));
      const now = new Date();
      // Unlocks at 6 AM local time or after 6 hours
      if (now.getTime() > lockoutDate.getTime() + 6 * 60 * 60 * 1000 || (now.getHours() >= 6 && now.getHours() < 24 && now.getDate() !== lockoutDate.getDate())) {
        localStorage.removeItem('realmsquiz_lockout');
      } else {
        isLockedOut = true;
      }
    }

    return {
      status: 'idle',
      quiz: null,
      mode: 'classic',
      currentQuestionIndex: 0,
      score: 0,
      combo: 1,
      maxCombo: 1,
      selectedAnswer: null,
      isAnswerChecked: false,
      searchQuery: '',
      isLockedOut,
      error: null,
      tournamentRoundItems: [],
      tournamentNextRoundItems: [],
      tournamentCurrentMatchup: null,
      tournamentWinner: null,
    };
  });

  useEffect(() => {
    const checkLockoutBackend = async () => {
      try {
        const fp = await fpPromise.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        const response = await fetch('/api/check-lockout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId })
        });
        const data = await response.json();
        
        if (data.isLockedOut) {
          localStorage.setItem('realmsquiz_lockout', Date.now().toString());
          setGameState(prev => ({ ...prev, isLockedOut: true }));
        }
      } catch (e) {
        console.error("Failed to check lockout:", e);
      }
    };
    
    checkLockoutBackend();
  }, []);

  useEffect(() => {
    const checkForceSleep = () => {
      const hour = new Date().getHours();
      // If time is 00:00 to 05:59 and they aren't already locked out or in warning
      if (hour >= 0 && hour <= 5) {
        if (!gameState.isLockedOut && gameState.status !== 'late-warning') {
          setGameState(prev => ({ ...prev, status: 'late-warning' }));
        }
      }
    };
    
    const interval = setInterval(checkForceSleep, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [gameState.isLockedOut, gameState.status]);

  const handleStartQuiz = async (query: string, mode: GameMode, skipWarning = false) => {
    const hour = new Date().getHours();
    
    // Check if it's late night (e.g. 00:00 to 05:59)
    if (!skipWarning && (hour >= 0 && hour <= 5)) {
      setGameState(prev => ({ ...prev, status: 'late-warning', searchQuery: query, mode }));
      return;
    }

    audio.init();
    audio.playStart();
    setGameState(prev => ({ ...prev, status: 'loading', searchQuery: query, mode, error: null }));
    
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error((errorData && errorData.error) ? errorData.error : 'Failed to generate quiz from server');
      }

      const data: QuizData = await response.json();
      
      let initialTournamentState = {
        tournamentRoundItems: [] as string[],
        tournamentNextRoundItems: [] as string[],
        tournamentCurrentMatchup: null as [string, string] | null,
        tournamentWinner: null as string | null
      };

      if (mode === 'this-or-that' && data.tournamentItems) {
        // Randomize the items
        const shuffled = [...data.tournamentItems].sort(() => Math.random() - 0.5);
        // Fallback to ensuring an even length
        const items = shuffled.length % 2 === 0 ? shuffled : shuffled.slice(0, shuffled.length - 1);
        initialTournamentState.tournamentRoundItems = items;
        initialTournamentState.tournamentNextRoundItems = [];
        if (items.length >= 2) {
          initialTournamentState.tournamentCurrentMatchup = [items[0], items[1]];
        }
      }

      setGameState(prev => ({
        ...prev,
        status: 'playing',
        quiz: data,
        currentQuestionIndex: 0,
        score: 0,
        combo: 1,
        maxCombo: 1,
        selectedAnswer: null,
        isAnswerChecked: false,
        ...initialTournamentState
      }));
    } catch (err: any) {
      console.error(err);
      
      const errorMessage = err.message || '';
      let displayError = 'Yeni alemler yaratılırken bir hata oluştu. Lütfen tekrar deneyin.';
      if (errorMessage.toLowerCase().includes('high demand') || errorMessage.toLowerCase().includes('503')) {
        displayError = 'Sistemlerimizde yoğunluk var, boyut kapıları zorlanıyor! (High Demand) Lütfen 10-15 saniye bekleyip tekrar deneyin.';
      }
      
      setGameState(prev => ({ 
        ...prev, 
        status: 'idle',
        error: displayError
      }));
    }
  };

  const handleProceedFromWarning = () => {
    handleStartQuiz(gameState.searchQuery, gameState.mode, true);
  };

  const handleCancelWarning = async () => {
    localStorage.setItem('realmsquiz_lockout', Date.now().toString());
    setGameState(prev => ({ ...prev, status: 'idle', searchQuery: '', isLockedOut: true }));

    try {
      const fp = await fpPromise.load();
      const result = await fp.get();
      const visitorId = result.visitorId;

      await fetch('/api/lockout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId })
      });
    } catch (e) {
      console.error("Failed to save lockout to server:", e);
    }
  };

  const handleAnswer = (answer: string) => {
    if (gameState.mode === 'this-or-that') {
      audio.playCorrect(); // just a nice selection sound
      setGameState(prev => {
        let newNextRound = [...prev.tournamentNextRoundItems, answer];
        let newRoundItems = [...prev.tournamentRoundItems];
        // Remove the first two items that we just matched up
        newRoundItems = newRoundItems.slice(2);
        
        let newMatchup: [string, string] | null = null;
        let newStatus = prev.status;
        let winner = prev.tournamentWinner;

        if (newRoundItems.length >= 2) {
          // Still have items in this round
          newMatchup = [newRoundItems[0], newRoundItems[1]];
        } else {
          // Round is over
          if (newNextRound.length === 1) {
            // Tournament is over!
            winner = newNextRound[0];
            newStatus = 'results';
          } else {
            // Setup next round
            newRoundItems = newNextRound;
            newNextRound = [];
            newMatchup = [newRoundItems[0], newRoundItems[1]];
          }
        }

        return {
          ...prev,
          tournamentNextRoundItems: newNextRound,
          tournamentRoundItems: newRoundItems,
          tournamentCurrentMatchup: newMatchup,
          tournamentWinner: winner,
          status: newStatus
        };
      });
      return;
    }

    if (gameState.isAnswerChecked) return;
    setGameState(prev => ({ ...prev, selectedAnswer: answer }));
  };

  const handleCheckAnswer = () => {
    if (!gameState.selectedAnswer || gameState.isAnswerChecked) return;
    
    const isCorrect = gameState.mode === 'this-or-that' ? true : (gameState.selectedAnswer === gameState.quiz?.questions[gameState.currentQuestionIndex].correctAnswer);
    
    if (isCorrect) {
      audio.playCorrect();
      setGameState(prev => {
        const newCombo = prev.combo + 1;
        return {
          ...prev,
          isAnswerChecked: true,
          score: prev.score + (100 * prev.combo),
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo)
        }
      });
    } else {
      audio.playWrong();
      setGameState(prev => ({
        ...prev,
        isAnswerChecked: true,
        combo: 1
      }));
    }
  };

  const handleNext = () => {
    setGameState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= (prev.quiz?.questions.length || 0)) {
        return { ...prev, status: 'results' };
      }
      audio.playNextLevel();
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        isAnswerChecked: false
      };
    });
  };

  const handlePlayAgain = () => {
    audio.playStart();
    setGameState(prev => ({
      ...prev,
      status: 'idle',
      quiz: null,
      mode: 'classic',
      searchQuery: ''
    }));
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-slate-950 text-white font-sans selection:bg-fuchsia-500 selection:text-white">
      <TimeWarningNotification />
      <AnimatePresence mode="wait">
        {gameState.status === 'idle' && (
          <SearchScreen 
            key="search" 
            onStart={handleStartQuiz} 
            isLockedOut={gameState.isLockedOut}
            initialQuery={gameState.searchQuery}
            initialMode={gameState.mode}
            error={gameState.error}
          />
        )}
        {gameState.status === 'late-warning' && (
          <LateNightWarningScreen 
            key="late-warning" 
            onProceed={handleProceedFromWarning} 
            onCancel={handleCancelWarning} 
          />
        )}
        {gameState.status === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-fuchsia-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-fuchsia-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-medium animate-pulse">Alem Yaratılıyor...</h2>
            <p className="text-slate-400">"{gameState.searchQuery || 'Kırathane'}" için sorular çağrılıyor</p>
          </motion.div>
        )}
        {gameState.status === 'playing' && gameState.quiz && (
          <QuizScreen 
            key="playing"
            state={gameState} 
            onAnswer={handleAnswer} 
            onCheck={handleCheckAnswer} 
            onNext={handleNext} 
          />
        )}
        {gameState.status === 'results' && (
          <ResultScreen 
            key="results"
            state={gameState} 
            onPlayAgain={handlePlayAgain} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}


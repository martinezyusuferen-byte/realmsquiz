export type GameMode = 'this-or-that' | 'classic';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  title: string;
  description: string;
  questions?: Question[];
  tournamentItems?: string[];
}

export interface GameState {
  status: 'idle' | 'late-warning' | 'loading' | 'playing' | 'results';
  quiz: QuizData | null;
  mode: GameMode;
  currentQuestionIndex: number; // for classic
  score: number;
  combo: number;
  maxCombo: number;
  selectedAnswer: string | null;
  isAnswerChecked: boolean;
  searchQuery: string;
  isLockedOut: boolean;
  error: string | null;
  
  // Tournament state
  tournamentRoundItems: string[];
  tournamentNextRoundItems: string[];
  tournamentCurrentMatchup: [string, string] | null;
  tournamentWinner: string | null;
}

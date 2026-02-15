// Reading session states
export type ReadingSessionStatus = 'idle' | 'running' | 'paused' | 'completed';

// Reading session data
export interface ReadingSessionState {
  currentWordIndex: number;
  elapsedMs: number;
  msPerWord: number;
  progressPercent: number;
  restartCount: number;
  selectedWpm: number;
  startCount: number;
  status: ReadingSessionStatus;
  totalWords: number;
  wordsRead: number;
}

// Reading session actions
export interface ReadingSessionActions {
  editText: () => void;
  pauseReading: () => void;
  restartReading: () => void;
  resumeReading: () => void;
  setSelectedWpm: (wpm: number) => void;
  startReading: (totalWords: number) => void;
}

// Tokenized content
export interface TokenizedContent {
  totalWords: number;
  words: string[];
}

// Reader configuration
export interface ReaderConfig {
  minWpm: number;
  maxWpm: number;
}

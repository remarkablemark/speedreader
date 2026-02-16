// Reading session states
export type ReadingSessionStatus = 'idle' | 'running' | 'paused' | 'completed';

// Word chunk for multiple words display
export interface WordChunk {
  /** The combined text of all words in chunk */
  text: string;

  /** Individual words that make up this chunk */
  words: string[];
}

// Reading session data
export interface ReadingSessionState {
  status: ReadingSessionStatus;
  currentWordIndex: number;
  selectedWpm: number;
  elapsedMs: number;
  // Multiple words display support
  currentChunkIndex: number;
  totalChunks: number;
  wordsPerChunk: number;
  // Store the actual words for chunk generation
  words: string[];
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

export type ReadingSessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface ReadingContent {
  rawText: string;
  words: string[];
  totalWords: number;
}

export interface ReadingSessionState {
  status: ReadingSessionStatus;
  currentWordIndex: number;
  selectedWpm: number;
  elapsedMs: number;
}

export interface ReadingSessionMetrics {
  wordsRead: number;
  totalWords: number;
  progressPercent: number;
}

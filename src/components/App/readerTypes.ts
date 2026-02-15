import type { ReadingSessionStatus } from 'src/types/readerTypes';

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
  // Multiple words display support
  currentChunkIndex: number;
  totalChunks: number;
  wordsPerChunk: number;
}

export interface ReadingSessionMetrics {
  wordsRead: number;
  totalWords: number;
  progressPercent: number;
  chunksRead: number;
  totalChunks: number;
}

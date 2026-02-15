import type { WordChunk } from './wordChunk.types';

export interface ReadingDisplayProps {
  currentWord: string;
  currentChunk: WordChunk | null;
  wordsPerChunk: number;
  hasWords: boolean;
}

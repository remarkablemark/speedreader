import type { WordChunk } from './WordChunk.types';

export interface ReadingDisplayProps {
  currentWord: string;
  currentChunk: WordChunk | null;
  wordsPerChunk: number;
  hasWords: boolean;
}

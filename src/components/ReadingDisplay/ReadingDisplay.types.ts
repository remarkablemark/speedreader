import type { WordChunk } from 'src/types';

export interface ReadingDisplayProps {
  currentWord: string;
  currentChunk: WordChunk | null;
  wordsPerChunk: number;
  hasWords: boolean;
}

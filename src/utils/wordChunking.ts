import type { WordChunk } from 'src/components/ReadingDisplay/wordChunk.types.ts';

import { MAX_WORD_COUNT } from './storage';

/**
 * Generate word chunks from tokenized content
 * @param words - Array of individual words
 * @param wordsPerChunk - Number of words per chunk (1-5)
 * @returns Array of WordChunk objects
 */
export function generateWordChunks(
  words: string[],
  wordsPerChunk: number,
): WordChunk[] {
  if (!words.length || wordsPerChunk < 1 || wordsPerChunk > MAX_WORD_COUNT) {
    return [];
  }

  const chunks: WordChunk[] = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunkWords = words.slice(i, i + wordsPerChunk);
    chunks.push({
      text: chunkWords.join(' '),
      words: chunkWords,
    });
  }

  return chunks;
}

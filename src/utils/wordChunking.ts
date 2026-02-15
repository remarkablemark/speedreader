import type { WordChunk } from 'src/components/ReadingDisplay/WordChunk.types.ts';
import type { TokenizedContent } from 'src/components/TextInput/TokenizedContent.types.ts';

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

/**
 * Extend tokenized content with word chunks
 * @param content - TokenizedContent with words array
 * @param wordsPerChunk - Number of words per chunk (1-5)
 * @returns Extended TokenizedContent with chunks
 */
export function extendTokenizedContentWithChunks(
  content: TokenizedContent,
  wordsPerChunk: number,
): TokenizedContent {
  if (
    !content.words.length ||
    wordsPerChunk < 1 ||
    wordsPerChunk > MAX_WORD_COUNT
  ) {
    return {
      ...content,
      chunks: [],
      totalChunks: 0,
    };
  }

  const chunks = generateWordChunks(content.words, wordsPerChunk);

  return {
    ...content,
    chunks,
    totalChunks: chunks.length,
  };
}

/**
 * Calculate progress based on current position and total
 * @param currentWordIndex - Current word position in original text
 * @param totalWords - Total number of words
 * @param totalChunks - Total number of chunks
 * @param currentChunkIndex - Current chunk position
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(
  currentWordIndex: number,
  totalWords: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _totalChunks: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _currentChunkIndex: number,
): number {
  if (totalWords === 0) return 0;

  // Progress based on word position for accuracy
  const wordProgress = (currentWordIndex / totalWords) * 100;

  return Math.round(wordProgress);
}

/**
 * Validate word chunking parameters
 * @param words - Array of words to chunk
 * @param wordsPerChunk - Words per chunk setting
 * @returns Validation result
 */
export function validateChunkingParams(
  words: string[],
  wordsPerChunk: number,
): { isValid: boolean; error?: string } {
  if (!Array.isArray(words)) {
    return { isValid: false, error: 'Words must be an array' };
  }

  if (
    !Number.isInteger(wordsPerChunk) ||
    wordsPerChunk < 1 ||
    wordsPerChunk > MAX_WORD_COUNT
  ) {
    return {
      isValid: false,
      error: `Words per chunk must be an integer between 1 and ${String(MAX_WORD_COUNT)}`,
    };
  }

  if (words.length === 0) {
    return { isValid: true };
  }

  return { isValid: true };
}

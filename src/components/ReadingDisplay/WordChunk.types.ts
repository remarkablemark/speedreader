/**
 * WordChunk interface for multiple words display
 * Represents a group of 1-5 words to be displayed together
 */

export interface WordChunk {
  /** The combined text of all words in chunk */
  text: string;

  /** Individual words that make up this chunk */
  words: string[];

  /** Index in original word array */
  startIndex: number;

  /** End index in original word array */
  endIndex: number;

  /** Whether chunk contains punctuation */
  hasPunctuation: boolean;
}

/**
 * Validation rules for WordChunk
 */
export const WordChunkValidation = {
  /** Minimum number of words per chunk */
  MIN_WORDS: 1,

  /** Maximum number of words per chunk */
  MAX_WORDS: 5,

  /** Maximum text length for display */
  MAX_TEXT_LENGTH: 200,
} as const;

/**
 * Type guard to validate WordChunk
 */
export function isValidWordChunk(chunk: unknown): chunk is WordChunk {
  if (!chunk || typeof chunk !== 'object') return false;

  const wc = chunk as WordChunk;

  return (
    typeof wc.text === 'string' &&
    wc.text.length > 0 &&
    wc.text.length <= WordChunkValidation.MAX_TEXT_LENGTH &&
    Array.isArray(wc.words) &&
    wc.words.length >= WordChunkValidation.MIN_WORDS &&
    wc.words.length <= WordChunkValidation.MAX_WORDS &&
    typeof wc.startIndex === 'number' &&
    typeof wc.endIndex === 'number' &&
    wc.startIndex >= 0 &&
    wc.endIndex >= wc.startIndex &&
    typeof wc.hasPunctuation === 'boolean'
  );
}

import type { WordChunk } from 'src/components/ReadingDisplay/wordChunk.types';

/**
 * Extended TokenizedContent interface for multiple words display
 * Supports both individual word tokenization and word chunking
 */
export interface TokenizedContent {
  /** Original individual words */
  words: string[];

  /** Total word count */
  totalWords: number;

  /** Generated word chunks for display */
  chunks: WordChunk[];

  /** Total chunk count */
  totalChunks: number;
}

/**
 * Validation rules for TokenizedContent
 */
export const TokenizedContentValidation = {
  /** Maximum text length for processing */
  MAX_TEXT_LENGTH: 1000000,

  /** Maximum words for processing */
  MAX_WORDS: 50000,
} as const;

/**
 * Type guard to validate TokenizedContent
 */
export function isValidTokenizedContent(
  content: unknown,
): content is TokenizedContent {
  if (!content || typeof content !== 'object') return false;

  const tc = content as TokenizedContent;

  return (
    Array.isArray(tc.words) &&
    Array.isArray(tc.chunks) &&
    typeof tc.totalWords === 'number' &&
    typeof tc.totalChunks === 'number' &&
    tc.totalWords === tc.words.length &&
    tc.totalChunks === tc.chunks.length &&
    tc.words.every((word) => typeof word === 'string') &&
    tc.chunks.every((chunk) => typeof chunk === 'object')
  );
}

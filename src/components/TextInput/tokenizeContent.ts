const WHITESPACE_DELIMITER_PATTERN = /\s+/;

import type { WordChunk } from 'src/components/ReadingDisplay/WordChunk.types.ts';

export interface TokenizedContent {
  words: string[];
  totalWords: number;
  chunks: WordChunk[];
  totalChunks: number;
}

/**
 * Determines whether text contains at least one readable token.
 */
export function hasReadableText(rawText: string): boolean {
  return rawText.trim().length > 0;
}

/**
 * Tokenizes input text in linear time without imposing a maximum size limit.
 */
export function tokenizeContent(rawText: string): TokenizedContent {
  if (!hasReadableText(rawText)) {
    return {
      words: [],
      totalWords: 0,
      chunks: [],
      totalChunks: 0,
    };
  }

  const words = rawText
    .trim()
    .split(WHITESPACE_DELIMITER_PATTERN)
    .filter((token) => token.length > 0);

  return {
    words,
    totalWords: words.length,
    chunks: [],
    totalChunks: 0,
  };
}

import { describe, expect, test } from 'vitest';

import type { TokenizedContent } from './TokenizedContent.types';
import {
  isValidTokenizedContent,
  TokenizedContentValidation,
} from './TokenizedContent.types';

describe('TokenizedContent.types', () => {
  describe('TokenizedContentValidation', () => {
    test('has correct validation constants', () => {
      expect(TokenizedContentValidation.MAX_TEXT_LENGTH).toBe(1000000);
      expect(TokenizedContentValidation.MAX_WORDS).toBe(50000);
    });

    test('is frozen as const', () => {
      expect(TokenizedContentValidation.MAX_TEXT_LENGTH).toBe(1000000);
      expect(TokenizedContentValidation.MAX_WORDS).toBe(50000);
    });
  });

  describe('isValidTokenizedContent', () => {
    test('returns true for valid TokenizedContent', () => {
      const validContent: TokenizedContent = {
        words: ['hello', 'world'],
        totalWords: 2,
        chunks: [
          { text: 'hello', words: ['hello'] },
          { text: 'world', words: ['world'] },
        ],
        totalChunks: 2,
      };

      expect(isValidTokenizedContent(validContent)).toBe(true);
    });

    test('returns false for null or undefined', () => {
      expect(isValidTokenizedContent(null)).toBe(false);
      expect(isValidTokenizedContent(undefined)).toBe(false);
    });

    test('returns false for non-object types', () => {
      expect(isValidTokenizedContent('string')).toBe(false);
      expect(isValidTokenizedContent(123)).toBe(false);
      expect(isValidTokenizedContent([])).toBe(false);
    });

    test('returns false when words is missing', () => {
      const contentWithoutWords = {
        totalWords: 2,
        chunks: [],
        totalChunks: 0,
      } as unknown as TokenizedContent;

      expect(isValidTokenizedContent(contentWithoutWords)).toBe(false);
    });

    test('returns false when words is not an array', () => {
      const contentWithInvalidWords = {
        words: 'not an array' as never,
        totalWords: 2,
        chunks: [],
        totalChunks: 0,
      };

      expect(isValidTokenizedContent(contentWithInvalidWords)).toBe(false);
    });

    test('returns false when chunks is missing', () => {
      const contentWithoutChunks = {
        words: ['hello'],
        totalWords: 1,
        totalChunks: 0,
      } as unknown as TokenizedContent;

      expect(isValidTokenizedContent(contentWithoutChunks)).toBe(false);
    });

    test('returns false when chunks is not an array', () => {
      const contentWithInvalidChunks = {
        words: ['hello'],
        totalWords: 1,
        chunks: 'not an array' as never,
        totalChunks: 0,
      };

      expect(isValidTokenizedContent(contentWithInvalidChunks)).toBe(false);
    });

    test('returns false when totalWords is not a number', () => {
      const contentWithInvalidTotalWords = {
        words: ['hello'],
        totalWords: '1' as unknown as number,
        chunks: [],
        totalChunks: 0,
      };

      expect(isValidTokenizedContent(contentWithInvalidTotalWords)).toBe(false);
    });

    test('returns false when totalChunks is not a number', () => {
      const contentWithInvalidTotalChunks = {
        words: ['hello'],
        totalWords: 1,
        chunks: [],
        totalChunks: '0' as unknown as number,
      };

      expect(isValidTokenizedContent(contentWithInvalidTotalChunks)).toBe(
        false,
      );
    });

    test('returns false when totalWords does not match words length', () => {
      const contentWithMismatchedWords: TokenizedContent = {
        words: ['hello', 'world'],
        totalWords: 1, // Doesn't match words.length
        chunks: [],
        totalChunks: 0,
      };

      expect(isValidTokenizedContent(contentWithMismatchedWords)).toBe(false);
    });

    test('returns false when totalChunks does not match chunks length', () => {
      const contentWithMismatchedChunks: TokenizedContent = {
        words: ['hello'],
        totalWords: 1,
        chunks: [{ text: 'hello', words: ['hello'] }],
        totalChunks: 2, // Doesn't match chunks.length
      };

      expect(isValidTokenizedContent(contentWithMismatchedChunks)).toBe(false);
    });

    test('returns false when words array contains non-strings', () => {
      const contentWithInvalidWordTypes: TokenizedContent = {
        words: ['hello', 123 as unknown as string],
        totalWords: 2,
        chunks: [],
        totalChunks: 0,
      };

      expect(isValidTokenizedContent(contentWithInvalidWordTypes)).toBe(false);
    });

    test('returns false when chunks array contains non-objects', () => {
      const contentWithInvalidChunkTypes: TokenizedContent = {
        words: ['hello'],
        totalWords: 1,
        chunks: ['not an object' as never],
        totalChunks: 1,
      };

      expect(isValidTokenizedContent(contentWithInvalidChunkTypes)).toBe(false);
    });

    test('returns true for empty arrays', () => {
      const emptyContent: TokenizedContent = {
        words: [],
        totalWords: 0,
        chunks: [],
        totalChunks: 0,
      };

      expect(isValidTokenizedContent(emptyContent)).toBe(true);
    });
  });
});

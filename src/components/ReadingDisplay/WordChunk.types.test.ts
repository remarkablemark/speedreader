import { describe, expect, test } from 'vitest';

import type { WordChunk } from './wordChunk.types';
import { isValidWordChunk, WordChunkValidation } from './wordChunk.types';

describe('WordChunk.types', () => {
  describe('WordChunkValidation', () => {
    test('has correct validation constants', () => {
      expect(WordChunkValidation.MIN_WORDS).toBe(1);
      expect(WordChunkValidation.MAX_WORDS).toBe(5);
      expect(WordChunkValidation.MAX_TEXT_LENGTH).toBe(200);
    });
  });

  describe('isValidWordChunk', () => {
    test('returns true for valid WordChunk', () => {
      const validChunk: WordChunk = {
        text: 'hello world',
        words: ['hello', 'world'],
      };

      expect(isValidWordChunk(validChunk)).toBe(true);
    });

    test('returns false for null or undefined', () => {
      expect(isValidWordChunk(null)).toBe(false);
      expect(isValidWordChunk(undefined)).toBe(false);
    });

    test('returns false for non-object types', () => {
      expect(isValidWordChunk('string')).toBe(false);
      expect(isValidWordChunk(123)).toBe(false);
      expect(isValidWordChunk([])).toBe(false);
    });

    test('returns false when text is missing', () => {
      const chunkWithoutText = {
        words: ['hello', 'world'],
      } as unknown as WordChunk;

      expect(isValidWordChunk(chunkWithoutText)).toBe(false);
    });

    test('returns false when text is not a string', () => {
      const chunkWithInvalidText = {
        text: 123,
        words: ['hello', 'world'],
      } as unknown as WordChunk;

      expect(isValidWordChunk(chunkWithInvalidText)).toBe(false);
    });

    test('returns false when text is empty', () => {
      const chunkWithEmptyText: WordChunk = {
        text: '',
        words: ['hello', 'world'],
      };

      expect(isValidWordChunk(chunkWithEmptyText)).toBe(false);
    });

    test('returns false when text exceeds maximum length', () => {
      const chunkWithLongText: WordChunk = {
        text: 'a'.repeat(201),
        words: ['hello', 'world'],
      };

      expect(isValidWordChunk(chunkWithLongText)).toBe(false);
    });

    test('returns false when words is missing', () => {
      const chunkWithoutWords = {
        text: 'hello world',
      } as unknown as WordChunk;

      expect(isValidWordChunk(chunkWithoutWords)).toBe(false);
    });

    test('returns false when words is not an array', () => {
      const chunkWithInvalidWords = {
        text: 'hello world',
        words: 'hello world',
      } as unknown as WordChunk;

      expect(isValidWordChunk(chunkWithInvalidWords)).toBe(false);
    });

    test('returns false when words array is empty', () => {
      const chunkWithEmptyWords: WordChunk = {
        text: 'hello',
        words: [],
      };

      expect(isValidWordChunk(chunkWithEmptyWords)).toBe(false);
    });

    test('returns false when words array has too few items', () => {
      const chunkWithTooFewWords: WordChunk = {
        text: 'hello',
        words: [],
      };

      expect(isValidWordChunk(chunkWithTooFewWords)).toBe(false);
    });

    test('returns false when words array has too many items', () => {
      const chunkWithTooManyWords: WordChunk = {
        text: 'one two three four five six',
        words: ['one', 'two', 'three', 'four', 'five', 'six'],
      };

      expect(isValidWordChunk(chunkWithTooManyWords)).toBe(false);
    });

    test('returns true for minimum valid WordChunk (1 word)', () => {
      const minChunk: WordChunk = {
        text: 'hello',
        words: ['hello'],
      };

      expect(isValidWordChunk(minChunk)).toBe(true);
    });

    test('returns true for maximum valid WordChunk (5 words)', () => {
      const maxChunk: WordChunk = {
        text: 'one two three four five',
        words: ['one', 'two', 'three', 'four', 'five'],
      };

      expect(isValidWordChunk(maxChunk)).toBe(true);
    });

    test('returns true for WordChunk with exactly maximum text length', () => {
      const chunkWithMaxText: WordChunk = {
        text: 'a'.repeat(200),
        words: ['a'.repeat(200)],
      };

      expect(isValidWordChunk(chunkWithMaxText)).toBe(true);
    });

    test('handles edge case with single character words', () => {
      const edgeCaseChunk: WordChunk = {
        text: 'a b c d e',
        words: ['a', 'b', 'c', 'd', 'e'],
      };

      expect(isValidWordChunk(edgeCaseChunk)).toBe(true);
    });
  });
});

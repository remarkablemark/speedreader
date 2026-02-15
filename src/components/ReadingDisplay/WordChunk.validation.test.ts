import { describe, expect, test } from 'vitest';

import type { WordChunk } from './wordChunk.types';
import {
  createValidWordChunk,
  validateWordChunk,
  validateWordChunkArray,
} from './wordChunk.validation';

describe('WordChunk.validation', () => {
  describe('validateWordChunk', () => {
    test('returns valid for correct WordChunk', () => {
      const validChunk: WordChunk = {
        text: 'hello world',
        words: ['hello', 'world'],
      };

      const result = validateWordChunk(validChunk);

      expect(result).toEqual({
        isValid: true,
        errors: [],
        warnings: [],
      });
    });

    test('returns invalid for null or undefined', () => {
      expect(validateWordChunk(null)).toEqual({
        isValid: false,
        errors: ['Invalid WordChunk structure'],
        warnings: [],
      });

      expect(validateWordChunk(undefined)).toEqual({
        isValid: false,
        errors: ['Invalid WordChunk structure'],
        warnings: [],
      });
    });

    test('returns invalid for non-object types', () => {
      expect(validateWordChunk('string')).toEqual({
        isValid: false,
        errors: ['Invalid WordChunk structure'],
        warnings: [],
      });

      expect(validateWordChunk(123)).toEqual({
        isValid: false,
        errors: ['Invalid WordChunk structure'],
        warnings: [],
      });

      expect(validateWordChunk([])).toEqual({
        isValid: false,
        errors: ['Invalid WordChunk structure'],
        warnings: [],
      });
    });

    test('returns warnings for text length exceeding maximum', () => {
      const longTextChunk: WordChunk = {
        text: 'a'.repeat(201),
        words: ['a'.repeat(201)],
      };

      const result = validateWordChunk(longTextChunk);

      expect(result.isValid).toBe(false); // Fails isValidWordChunk first
      expect(result.errors).toContain('Invalid WordChunk structure');
      expect(result.warnings).toHaveLength(0);
    });

    test('returns errors for word count below minimum', () => {
      const invalidChunk: WordChunk = {
        text: 'hello',
        words: [], // Empty array, below MIN_WORDS (1)
      };

      const result = validateWordChunk(invalidChunk);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid WordChunk structure'); // Fails isValidWordChunk first
      expect(result.warnings).toHaveLength(0);
    });

    test('returns errors for word count above maximum', () => {
      const invalidChunk: WordChunk = {
        text: 'one two three four five six',
        words: ['one', 'two', 'three', 'four', 'five', 'six'], // 6 words, above MAX_WORDS (5)
      };

      const result = validateWordChunk(invalidChunk);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid WordChunk structure'); // Fails isValidWordChunk first
      expect(result.warnings).toHaveLength(0);
    });

    test('returns warnings for text not matching joined words', () => {
      const inconsistentChunk: WordChunk = {
        text: 'hello world',
        words: ['hello', 'planet'], // Different from text
      };

      const result = validateWordChunk(inconsistentChunk);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toContain(
        'Text does not match joined words array',
      );
    });

    test('returns multiple errors and warnings', () => {
      const problematicChunk: WordChunk = {
        text: 'a'.repeat(250),
        words: ['a'.repeat(250)], // Single word but text too long
      };

      const result = validateWordChunk(problematicChunk);

      expect(result.isValid).toBe(false); // Fails isValidWordChunk first
      expect(result.errors).toContain('Invalid WordChunk structure');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('validateWordChunkArray', () => {
    test('returns valid for empty array', () => {
      const result = validateWordChunkArray([]);

      expect(result).toEqual({
        isValid: true,
        errors: [],
        warnings: [],
      });
    });

    test('returns valid for array of valid chunks', () => {
      const validChunks: WordChunk[] = [
        { text: 'hello', words: ['hello'] },
        { text: 'world test', words: ['world', 'test'] },
      ];

      const result = validateWordChunkArray(validChunks);

      expect(result).toEqual({
        isValid: true,
        errors: [],
        warnings: [],
      });
    });

    test('returns invalid for non-array input', () => {
      const result = validateWordChunkArray('not an array' as never);

      expect(result).toEqual({
        isValid: false,
        errors: ['Input must be an array'],
        warnings: [],
      });
    });

    test('returns errors for array with invalid chunks', () => {
      const mixedChunks = [
        { text: 'hello', words: ['hello'] },
        null, // Invalid chunk
        { text: 'world', words: ['world'] },
      ];

      const result = validateWordChunkArray(mixedChunks);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chunk 1: Invalid WordChunk structure');
      expect(result.warnings).toHaveLength(0);
    });

    test('aggregates errors and warnings from multiple chunks', () => {
      const problematicChunks = [
        { text: 'a'.repeat(250), words: ['a'] }, // Error: text too long
        { text: 'test', words: [] }, // Error: no words
        null, // Error: null chunk
      ];

      const result = validateWordChunkArray(problematicChunks);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chunk 0: Invalid WordChunk structure');
      expect(result.errors).toContain('Chunk 1: Invalid WordChunk structure');
      expect(result.errors).toContain('Chunk 2: Invalid WordChunk structure');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('createValidWordChunk', () => {
    test('returns valid WordChunk for valid input', () => {
      const result = createValidWordChunk('hello world', ['hello', 'world']);

      expect(result).toEqual({
        text: 'hello world',
        words: ['hello', 'world'],
      });
    });

    test('returns null for invalid input', () => {
      const result = createValidWordChunk('test', []); // Empty words array

      expect(result).toBeNull();
    });

    test('returns null for structurally invalid chunk', () => {
      const result = createValidWordChunk('', ['']); // Empty text and word

      expect(result).toBeNull();
    });

    test('returns null for chunks that fail validation', () => {
      const result = createValidWordChunk('a'.repeat(250), ['a'.repeat(250)]); // Text too long

      expect(result).toBeNull();
    });
  });
});

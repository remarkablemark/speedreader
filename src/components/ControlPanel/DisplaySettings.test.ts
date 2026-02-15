import { describe, expect, test } from 'vitest';

import {
  createDefaultDisplaySettings,
  createValidDisplaySettings,
  deserializeDisplaySettings,
  getDisplayModeDescription,
  isMultipleWordsMode,
  serializeDisplaySettings,
  updateDisplaySettings,
  validateDisplaySettings,
} from './DisplaySettings';
import type { DisplaySettings } from './DisplaySettings.types';

describe('DisplaySettings', () => {
  describe('createDefaultDisplaySettings', () => {
    test('returns default settings', () => {
      const result = createDefaultDisplaySettings();

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('returns a new object each time', () => {
      const result1 = createDefaultDisplaySettings();
      const result2 = createDefaultDisplaySettings();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe('createValidDisplaySettings', () => {
    test('returns valid settings for valid input', () => {
      const result = createValidDisplaySettings(3);

      expect(result).toEqual({
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      });
    });

    test('returns default settings for invalid input (too low)', () => {
      const result = createValidDisplaySettings(0);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('returns default settings for invalid input (too high)', () => {
      const result = createValidDisplaySettings(10);

      expect(result).toEqual({
        wordsPerChunk: 5, // Clamped to maximum
        isMultipleWordsMode: true,
      });
    });

    test('returns default settings for negative input', () => {
      const result = createValidDisplaySettings(-5);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });
  });

  describe('updateDisplaySettings', () => {
    test('updates with valid word count', () => {
      const current: DisplaySettings = {
        wordsPerChunk: 2,
        isMultipleWordsMode: true,
      };

      const result = updateDisplaySettings(current, 4);

      expect(result).toEqual({
        wordsPerChunk: 4,
        isMultipleWordsMode: true,
      });
    });

    test('returns default settings for invalid word count', () => {
      const current: DisplaySettings = {
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      };

      const result = updateDisplaySettings(current, 0);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('ignores current settings and uses validation', () => {
      const current: DisplaySettings = {
        wordsPerChunk: 2,
        isMultipleWordsMode: true,
      };

      const result = updateDisplaySettings(current, 1);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });
  });

  describe('isMultipleWordsMode', () => {
    test('returns false for single word mode', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      };

      expect(isMultipleWordsMode(settings)).toBe(false);
    });

    test('returns true for multiple words mode', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      };

      expect(isMultipleWordsMode(settings)).toBe(true);
    });

    test('returns false for edge case of 1 word', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 1,
        isMultipleWordsMode: true, // Even if flag is true, word count determines mode
      };

      expect(isMultipleWordsMode(settings)).toBe(false);
    });
  });

  describe('getDisplayModeDescription', () => {
    test('returns "Single word" for single word mode', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      };

      expect(getDisplayModeDescription(settings)).toBe('Single word');
    });

    test('returns "X words" for multiple words mode', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      };

      expect(getDisplayModeDescription(settings)).toBe('3 words');
    });

    test('handles edge case of 2 words', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 2,
        isMultipleWordsMode: true,
      };

      expect(getDisplayModeDescription(settings)).toBe('2 words');
    });

    test('handles maximum words', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 5,
        isMultipleWordsMode: true,
      };

      expect(getDisplayModeDescription(settings)).toBe('5 words');
    });
  });

  describe('validateDisplaySettings', () => {
    test('returns valid for correct settings', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      };

      const result = validateDisplaySettings(settings);

      expect(result).toEqual({
        isValid: true,
        errors: [],
        warnings: [],
      });
    });

    test('returns errors for words below minimum', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 0,
        isMultipleWordsMode: false,
      };

      const result = validateDisplaySettings(settings);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid DisplaySettings structure');
      expect(result.warnings).toHaveLength(0);
    });

    test('returns errors for words above maximum', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 10,
        isMultipleWordsMode: true,
      };

      const result = validateDisplaySettings(settings);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid DisplaySettings structure');
      expect(result.warnings).toHaveLength(0);
    });

    test('returns warnings for mode inconsistency', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 3,
        isMultipleWordsMode: false, // Inconsistent with wordsPerChunk
      };

      const result = validateDisplaySettings(settings);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toContain(
        'isMultipleWordsMode does not match wordsPerChunk value',
      );
    });

    test('returns multiple errors for multiple issues', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: -5,
        isMultipleWordsMode: true,
      };

      const result = validateDisplaySettings(settings);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid DisplaySettings structure');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('serializeDisplaySettings', () => {
    test('serializes to JSON string', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      };

      const result = serializeDisplaySettings(settings);

      expect(result).toBe('{"wordsPerChunk":3,"isMultipleWordsMode":true}');
    });

    test('handles single word mode', () => {
      const settings: DisplaySettings = {
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      };

      const result = serializeDisplaySettings(settings);

      expect(result).toBe('{"wordsPerChunk":1,"isMultipleWordsMode":false}');
    });
  });

  describe('deserializeDisplaySettings', () => {
    test('deserializes valid JSON', () => {
      const json = '{"wordsPerChunk":3,"isMultipleWordsMode":true}';

      const result = deserializeDisplaySettings(json);

      expect(result).toEqual({
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      });
    });

    test('returns default settings for invalid JSON', () => {
      const json = '{"invalid":"json"}';

      const result = deserializeDisplaySettings(json);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('returns default settings for malformed JSON', () => {
      const json = 'not valid json';

      const result = deserializeDisplaySettings(json);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('returns default settings for empty string', () => {
      const result = deserializeDisplaySettings('');

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('handles JSON with invalid values', () => {
      const json = '{"wordsPerChunk":0,"isMultipleWordsMode":false}';

      const result = deserializeDisplaySettings(json);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });
  });
});

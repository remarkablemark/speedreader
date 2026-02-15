import { describe, expect, test } from 'vitest';

import type { DisplaySettings } from './DisplaySettings.types';
import {
  createDisplaySettings,
  DEFAULT_DISPLAY_SETTINGS,
  DisplaySettingsValidation,
  isValidDisplaySettings,
} from './DisplaySettings.types';

describe('DisplaySettings.types', () => {
  describe('DEFAULT_DISPLAY_SETTINGS', () => {
    test('has correct default values', () => {
      expect(DEFAULT_DISPLAY_SETTINGS).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('is frozen as const', () => {
      expect(DEFAULT_DISPLAY_SETTINGS.wordsPerChunk).toBe(1);
      expect(DEFAULT_DISPLAY_SETTINGS.isMultipleWordsMode).toBe(false);
    });
  });

  describe('DisplaySettingsValidation', () => {
    test('has correct validation constants', () => {
      expect(DisplaySettingsValidation.MIN_WORDS).toBe(1);
      expect(DisplaySettingsValidation.MAX_WORDS).toBe(5);
    });

    test('is frozen as const', () => {
      expect(DisplaySettingsValidation.MIN_WORDS).toBe(1);
      expect(DisplaySettingsValidation.MAX_WORDS).toBe(5);
    });
  });

  describe('isValidDisplaySettings', () => {
    test('returns true for valid DisplaySettings', () => {
      const validSettings: DisplaySettings = {
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      };

      expect(isValidDisplaySettings(validSettings)).toBe(true);
    });

    test('returns false for null or undefined', () => {
      expect(isValidDisplaySettings(null)).toBe(false);
      expect(isValidDisplaySettings(undefined)).toBe(false);
    });

    test('returns false for non-object types', () => {
      expect(isValidDisplaySettings('string')).toBe(false);
      expect(isValidDisplaySettings(123)).toBe(false);
      expect(isValidDisplaySettings([])).toBe(false);
    });

    test('returns false when wordsPerChunk is missing', () => {
      const settingsWithoutWords = {
        isMultipleWordsMode: true,
      } as unknown as DisplaySettings;

      expect(isValidDisplaySettings(settingsWithoutWords)).toBe(false);
    });

    test('returns false when wordsPerChunk is not a number', () => {
      const settingsWithInvalidWords = {
        wordsPerChunk: '3' as unknown as number,
        isMultipleWordsMode: true,
      };

      expect(isValidDisplaySettings(settingsWithInvalidWords)).toBe(false);
    });

    test('returns false when wordsPerChunk is below minimum', () => {
      const settingsWithLowWords: DisplaySettings = {
        wordsPerChunk: 0,
        isMultipleWordsMode: false,
      };

      expect(isValidDisplaySettings(settingsWithLowWords)).toBe(false);
    });

    test('returns false when wordsPerChunk is above maximum', () => {
      const settingsWithHighWords: DisplaySettings = {
        wordsPerChunk: 10,
        isMultipleWordsMode: true,
      };

      expect(isValidDisplaySettings(settingsWithHighWords)).toBe(false);
    });

    test('returns false when isMultipleWordsMode is missing', () => {
      const settingsWithoutMode = {
        wordsPerChunk: 3,
      } as unknown as DisplaySettings;

      expect(isValidDisplaySettings(settingsWithoutMode)).toBe(false);
    });

    test('returns false when isMultipleWordsMode is not a boolean', () => {
      const settingsWithInvalidMode = {
        wordsPerChunk: 3,
        isMultipleWordsMode: 'true' as unknown as boolean,
      };

      expect(isValidDisplaySettings(settingsWithInvalidMode)).toBe(false);
    });

    test('returns true for boundary values', () => {
      const minSettings: DisplaySettings = {
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      };

      const maxSettings: DisplaySettings = {
        wordsPerChunk: 5,
        isMultipleWordsMode: true,
      };

      expect(isValidDisplaySettings(minSettings)).toBe(true);
      expect(isValidDisplaySettings(maxSettings)).toBe(true);
    });
  });

  describe('createDisplaySettings', () => {
    test('creates valid settings for normal input', () => {
      const result = createDisplaySettings(3);

      expect(result).toEqual({
        wordsPerChunk: 3,
        isMultipleWordsMode: true,
      });
    });

    test('clamps values below minimum', () => {
      const result = createDisplaySettings(0);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('clamps values above maximum', () => {
      const result = createDisplaySettings(10);

      expect(result).toEqual({
        wordsPerChunk: 5,
        isMultipleWordsMode: true,
      });
    });

    test('handles negative values', () => {
      const result = createDisplaySettings(-5);

      expect(result).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });
    });

    test('handles boundary values', () => {
      const minResult = createDisplaySettings(1);
      const maxResult = createDisplaySettings(5);

      expect(minResult).toEqual({
        wordsPerChunk: 1,
        isMultipleWordsMode: false,
      });

      expect(maxResult).toEqual({
        wordsPerChunk: 5,
        isMultipleWordsMode: true,
      });
    });

    test('sets isMultipleWordsMode correctly based on wordsPerChunk', () => {
      const singleWordResult = createDisplaySettings(1);
      const multipleWordsResult = createDisplaySettings(2);

      expect(singleWordResult.isMultipleWordsMode).toBe(false);
      expect(multipleWordsResult.isMultipleWordsMode).toBe(true);
    });
  });
});

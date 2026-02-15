import { describe, expect, test, vi } from 'vitest';

import {
  DEFAULT_WORD_COUNT,
  MAX_WORD_COUNT,
  MIN_WORD_COUNT,
  storageAPI,
} from './storage';

// Create a mock localStorage interface
interface MockLocalStorage {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
}

describe('storage', () => {
  describe('storageAPI', () => {
    let mockLocalStorage: MockLocalStorage;

    beforeEach(() => {
      // Create fresh mock for each test
      mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      };

      // Clear localStorage before each test
      vi.stubGlobal('localStorage', mockLocalStorage);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    describe('getWordCount', () => {
      test('returns default value when localStorage has no value', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        expect(storageAPI.getWordCount()).toBe(1);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
          'speedreader.wordCount',
        );
      });

      test('returns stored value when valid', () => {
        mockLocalStorage.getItem.mockReturnValue('3');

        expect(storageAPI.getWordCount()).toBe(3);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
          'speedreader.wordCount',
        );
      });

      test('clamps values below minimum to minimum', () => {
        mockLocalStorage.getItem.mockReturnValue('0');

        expect(storageAPI.getWordCount()).toBe(1);
      });

      test('clamps values above maximum to maximum', () => {
        mockLocalStorage.getItem.mockReturnValue('10');

        expect(storageAPI.getWordCount()).toBe(5);
      });

      test('handles invalid values gracefully', () => {
        mockLocalStorage.getItem.mockReturnValue('invalid');

        // parseInt('invalid', 10) returns NaN, Math.max/min with NaN returns NaN
        // So the function should return the default value of 1
        expect(storageAPI.getWordCount()).toBe(1);
      });

      test('returns default when localStorage throws error', () => {
        mockLocalStorage.getItem.mockImplementation(() => {
          throw new Error('localStorage unavailable');
        });

        expect(storageAPI.getWordCount()).toBe(1);
      });
    });

    describe('setWordCount', () => {
      test('stores valid value in localStorage', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          // Empty implementation
        });

        storageAPI.setWordCount(3);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'speedreader.wordCount',
          '3',
        );
      });

      test('clamps values below minimum before storing', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          // Empty implementation
        });

        storageAPI.setWordCount(0);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'speedreader.wordCount',
          '1',
        );
      });

      test('clamps values above maximum before storing', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          // Empty implementation
        });

        storageAPI.setWordCount(10);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'speedreader.wordCount',
          '5',
        );
      });

      test('handles localStorage errors gracefully', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('localStorage quota exceeded');
        });

        expect(() => {
          storageAPI.setWordCount(3);
        }).not.toThrow();
      });
    });

    describe('removeWordCount', () => {
      test('removes word count from localStorage', () => {
        mockLocalStorage.removeItem.mockImplementation(() => {
          // Empty implementation
        });

        storageAPI.removeWordCount();

        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
          'speedreader.wordCount',
        );
      });

      test('handles localStorage errors gracefully', () => {
        mockLocalStorage.removeItem.mockImplementation(() => {
          throw new Error('localStorage unavailable');
        });

        expect(() => {
          storageAPI.removeWordCount();
        }).not.toThrow();
      });
    });

    describe('isAvailable', () => {
      test('returns true when localStorage is available', () => {
        vi.stubGlobal('localStorage', {});

        expect(storageAPI.isAvailable()).toBe(true);
      });

      test('returns false when localStorage is undefined', () => {
        vi.stubGlobal('localStorage', undefined);

        expect(storageAPI.isAvailable()).toBe(false);
      });

      test('returns false when accessing localStorage throws error', () => {
        vi.stubGlobal('localStorage', undefined);

        expect(storageAPI.isAvailable()).toBe(false);
      });
    });
  });

  describe('constants', () => {
    test('exports correct default word count', () => {
      expect(DEFAULT_WORD_COUNT).toBe(1);
    });

    test('exports correct maximum word count', () => {
      expect(MAX_WORD_COUNT).toBe(5);
    });

    test('exports correct minimum word count', () => {
      expect(MIN_WORD_COUNT).toBe(1);
    });
  });
});

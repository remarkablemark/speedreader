import { storageAPI } from 'src/utils/storage';
import { afterEach, beforeEach, describe, expect, vi } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('storageAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('getWordCount', () => {
    it('returns saved word count when valid', () => {
      localStorageMock.getItem.mockReturnValue('3');

      const result = storageAPI.getWordCount();

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'speedreader.wordCount',
      );
      expect(result).toBe(3);
    });

    it('returns default 1 when no saved value', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = storageAPI.getWordCount();

      expect(result).toBe(1);
    });

    it('returns default 1 when localStorage throws error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const result = storageAPI.getWordCount();

      expect(result).toBe(1);
    });

    it('clamps high values to maximum 5', () => {
      localStorageMock.getItem.mockReturnValue('10');

      const result = storageAPI.getWordCount();

      expect(result).toBe(5);
    });

    it('clamps low values to minimum 1', () => {
      localStorageMock.getItem.mockReturnValue('0');

      const result = storageAPI.getWordCount();

      expect(result).toBe(1);
    });

    it('clamps negative values to minimum 1', () => {
      localStorageMock.getItem.mockReturnValue('-5');

      const result = storageAPI.getWordCount();

      expect(result).toBe(1);
    });

    it('handles invalid string values', () => {
      localStorageMock.getItem.mockReturnValue('invalid');

      const result = storageAPI.getWordCount();

      expect(result).toBe(1); // Fixed implementation returns 1 for invalid values
    });
  });

  describe('setWordCount', () => {
    it('saves valid word count', () => {
      storageAPI.setWordCount(3);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'speedreader.wordCount',
        '3',
      );
    });

    it('clamps high values to maximum 5', () => {
      storageAPI.setWordCount(10);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'speedreader.wordCount',
        '5',
      );
    });

    it('clamps low values to minimum 1', () => {
      storageAPI.setWordCount(0);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'speedreader.wordCount',
        '1',
      );
    });

    it('clamps negative values to minimum 1', () => {
      storageAPI.setWordCount(-5);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'speedreader.wordCount',
        '1',
      );
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      // Should not throw
      expect(() => {
        storageAPI.setWordCount(3);
      }).not.toThrow();
    });
  });

  describe('removeWordCount', () => {
    it('removes word count from localStorage', () => {
      storageAPI.removeWordCount();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'speedreader.wordCount',
      );
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      // Should not throw
      expect(() => {
        storageAPI.removeWordCount();
      }).not.toThrow();
    });
  });

  describe('isAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(storageAPI.isAvailable()).toBe(true);
    });

    it('returns false when localStorage is undefined', () => {
      const originalLocalStorage = (window as any).localStorage;

      delete (window as any).localStorage;

      expect(storageAPI.isAvailable()).toBe(false);

      // Restore localStorage
      (window as any).localStorage = originalLocalStorage;
    });

    it('returns false when localStorage throws error', () => {
      const originalLocalStorage = window.localStorage;

      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage unavailable');
        },
        configurable: true,
      });

      expect(storageAPI.isAvailable()).toBe(false);

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      });
    });
  });
});

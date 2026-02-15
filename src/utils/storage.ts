/**
 * localStorage utility for persisting user preferences
 * Handles errors gracefully and provides fallbacks
 */

const WORD_COUNT_KEY = 'speedreader.wordCount';

/**
 * Storage API for word count preferences
 */
export const storageAPI = {
  /**
   * Get word count from localStorage
   * @returns Word count value (1-5) or default 1
   */
  getWordCount(): number {
    try {
      const value = localStorage.getItem(WORD_COUNT_KEY);
      if (!value) return 1;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 1 : Math.max(1, Math.min(5, parsed));
    } catch {
      // localStorage unavailable or quota exceeded
      return 1;
    }
  },

  /**
   * Save word count to localStorage
   * @param count - Word count value (1-5)
   */
  setWordCount(count: number): void {
    try {
      const clampedCount = Math.max(1, Math.min(5, count));
      localStorage.setItem(WORD_COUNT_KEY, clampedCount.toString());
    } catch {
      // Silently fail on quota exceeded or other localStorage errors
      // Could add error logging here if needed
    }
  },

  /**
   * Remove word count from localStorage
   */
  removeWordCount(): void {
    try {
      localStorage.removeItem(WORD_COUNT_KEY);
    } catch {
      // Silently fail on localStorage errors
    }
  },

  /**
   * Check if localStorage is available
   * @returns True if localStorage is available
   */
  isAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  },
};

/**
 * Default word count when no saved value exists
 */
export const DEFAULT_WORD_COUNT = 1;

/**
 * Maximum allowed word count
 */
export const MAX_WORD_COUNT = 5;

/**
 * Minimum allowed word count
 */
export const MIN_WORD_COUNT = 1;

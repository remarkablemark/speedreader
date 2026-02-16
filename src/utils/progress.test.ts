import {
  calculateProgressMetrics,
  calculateProgressPercentage,
  formatProgress,
  recalculateProgressOnWordCountChange,
  validateProgressParams,
} from './progress';

describe('progress', () => {
  describe('calculateProgressPercentage', () => {
    it('returns 0 when totalWords is 0', () => {
      expect(calculateProgressPercentage(5, 0)).toBe(0);
    });

    it('returns 0 when currentWordIndex is negative', () => {
      expect(calculateProgressPercentage(-1, 10)).toBe(0);
    });

    it('returns 100 when currentWordIndex exceeds totalWords', () => {
      expect(calculateProgressPercentage(15, 10)).toBe(100);
    });

    it('returns 100 when currentWordIndex equals totalWords', () => {
      expect(calculateProgressPercentage(10, 10)).toBe(100);
    });

    it('calculates correct percentage for normal cases', () => {
      expect(calculateProgressPercentage(5, 10)).toBe(50);
      expect(calculateProgressPercentage(2, 4)).toBe(50);
      expect(calculateProgressPercentage(1, 3)).toBe(33);
      expect(calculateProgressPercentage(0, 10)).toBe(0);
    });

    it('handles edge case with single word', () => {
      expect(calculateProgressPercentage(0, 1)).toBe(0);
      expect(calculateProgressPercentage(1, 1)).toBe(100);
    });
  });

  describe('calculateProgressMetrics', () => {
    it('calculates complete metrics for normal progress', () => {
      const result = calculateProgressMetrics(5, 10, 2, 5, 2);

      expect(result).toEqual({
        progressPercent: 50,
        wordsRead: 6,
        chunksRead: 3,
        wordsRemaining: 4,
        chunksRemaining: 2,
        estimatedTimeRemaining: 240, // 4 words * 60ms
      });
    });

    it('handles completion case', () => {
      const result = calculateProgressMetrics(10, 10, 4, 4, 3);

      expect(result).toEqual({
        progressPercent: 100,
        wordsRead: 10,
        chunksRead: 4,
        wordsRemaining: 0,
        chunksRemaining: 0,
        estimatedTimeRemaining: 0,
      });
    });

    it('handles start case', () => {
      const result = calculateProgressMetrics(0, 10, 0, 5, 2);

      expect(result).toEqual({
        progressPercent: 0,
        wordsRead: 1,
        chunksRead: 1,
        wordsRemaining: 9,
        chunksRemaining: 4,
        estimatedTimeRemaining: 540, // 9 words * 60ms
      });
    });

    it('handles single word case', () => {
      const result = calculateProgressMetrics(0, 1, 0, 1, 1);

      expect(result).toEqual({
        progressPercent: 0,
        wordsRead: 1,
        chunksRead: 1,
        wordsRemaining: 0,
        chunksRemaining: 0,
        estimatedTimeRemaining: 0,
      });
    });

    it('ensures wordsRead never exceeds totalWords', () => {
      const result = calculateProgressMetrics(15, 10, 7, 5, 3);

      expect(result.wordsRead).toBe(10);
      expect(result.chunksRead).toBe(5);
    });

    it('ensures chunksRead never exceeds totalChunks', () => {
      const result = calculateProgressMetrics(5, 10, 7, 5, 2);

      expect(result.chunksRead).toBe(5);
    });

    it('ensures remaining values are never negative', () => {
      const result = calculateProgressMetrics(15, 10, 7, 5, 3);

      expect(result.wordsRemaining).toBe(0);
      expect(result.chunksRemaining).toBe(0);
      expect(result.estimatedTimeRemaining).toBe(0);
    });

    it('handles edge case with zero total words', () => {
      const result = calculateProgressMetrics(0, 0, 0, 0, 1);

      expect(result).toEqual({
        progressPercent: 0,
        wordsRead: 0,
        chunksRead: 0,
        wordsRemaining: 0,
        chunksRemaining: 0,
        estimatedTimeRemaining: 0,
      });
    });

    it('handles edge case with negative indices gracefully', () => {
      const result = calculateProgressMetrics(-1, 10, -1, 5, 2);

      expect(result.progressPercent).toBe(0);
      expect(result.wordsRead).toBe(0);
      expect(result.chunksRead).toBe(0);
    });
  });

  describe('recalculateProgressOnWordCountChange', () => {
    it('calculates new chunk index correctly', () => {
      const result = recalculateProgressOnWordCountChange(5, 10, 3);

      expect(result).toEqual({
        newChunkIndex: 1, // Math.floor(5 / 3) = 1
        progressPercent: 50,
      });
    });

    it('handles edge case at exact chunk boundary', () => {
      const result = recalculateProgressOnWordCountChange(6, 10, 3);

      expect(result).toEqual({
        newChunkIndex: 2, // Math.floor(6 / 3) = 2
        progressPercent: 60,
      });
    });

    it('handles single word per chunk', () => {
      const result = recalculateProgressOnWordCountChange(5, 10, 1);

      expect(result).toEqual({
        newChunkIndex: 5, // Math.floor(5 / 1) = 5
        progressPercent: 50,
      });
    });

    it('handles start position', () => {
      const result = recalculateProgressOnWordCountChange(0, 10, 2);

      expect(result).toEqual({
        newChunkIndex: 0,
        progressPercent: 0,
      });
    });

    it('handles completion', () => {
      const result = recalculateProgressOnWordCountChange(10, 10, 3);

      expect(result).toEqual({
        newChunkIndex: 3, // Math.floor(10 / 3) = 3
        progressPercent: 100,
      });
    });

    it('ensures newChunkIndex is never negative', () => {
      const result = recalculateProgressOnWordCountChange(-1, 10, 2);

      expect(result.newChunkIndex).toBe(0);
    });
  });

  describe('formatProgress', () => {
    it('formats progress for single word display', () => {
      const result = formatProgress(50, 5, 5, 1);

      expect(result).toBe('5 word · 50%');
    });

    it('formats progress for multiple words display', () => {
      const result = formatProgress(75, 15, 5, 3);

      expect(result).toBe('5 chunk · 75%');
    });

    it('handles edge case with 0 progress', () => {
      const result = formatProgress(0, 0, 0, 2);

      expect(result).toBe('0 chunk · 0%');
    });

    it('handles edge case with 100 progress', () => {
      const result = formatProgress(100, 20, 10, 2);

      expect(result).toBe('10 chunk · 100%');
    });

    it('uses correct unit based on wordsPerChunk', () => {
      expect(formatProgress(25, 5, 5, 1)).toBe('5 word · 25%');
      expect(formatProgress(25, 5, 3, 2)).toBe('3 chunk · 25%');
      expect(formatProgress(25, 5, 2, 5)).toBe('2 chunk · 25%');
    });
  });

  describe('validateProgressParams', () => {
    it('returns valid for correct parameters', () => {
      const result = validateProgressParams(5, 10);

      expect(result).toEqual({ isValid: true });
    });

    it('returns invalid for negative currentWordIndex', () => {
      const result = validateProgressParams(-1, 10);

      expect(result).toEqual({
        isValid: false,
        error: 'Current word index must be a non-negative integer',
      });
    });

    it('returns invalid for non-integer currentWordIndex', () => {
      const result = validateProgressParams(5.5, 10);

      expect(result).toEqual({
        isValid: false,
        error: 'Current word index must be a non-negative integer',
      });
    });

    it('returns invalid for negative totalWords', () => {
      const result = validateProgressParams(5, -1);

      expect(result).toEqual({
        isValid: false,
        error: 'Total words must be a non-negative integer',
      });
    });

    it('returns invalid for non-integer totalWords', () => {
      const result = validateProgressParams(5, 10.5);

      expect(result).toEqual({
        isValid: false,
        error: 'Total words must be a non-negative integer',
      });
    });

    it('returns invalid when currentWordIndex exceeds totalWords', () => {
      const result = validateProgressParams(15, 10);

      expect(result).toEqual({
        isValid: false,
        error: 'Current word index cannot exceed total words',
      });
    });

    it('returns valid for edge cases', () => {
      expect(validateProgressParams(0, 0)).toEqual({ isValid: true });
      expect(validateProgressParams(0, 1)).toEqual({ isValid: true });
      expect(validateProgressParams(1, 1)).toEqual({ isValid: true });
      expect(validateProgressParams(10, 10)).toEqual({ isValid: true });
    });

    it('returns valid for large numbers', () => {
      const result = validateProgressParams(10000, 20000);

      expect(result).toEqual({ isValid: true });
    });

    it('handles floating point zero edge cases', () => {
      expect(validateProgressParams(0.0, 0)).toEqual({ isValid: true });
      expect(validateProgressParams(0, 0.0)).toEqual({ isValid: true });
    });
  });
});

/* eslint-disable @typescript-eslint/unbound-method */
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { storageAPI } from '../../utils/storage';
import { useReadingSession } from './useReadingSession';

// Mock storageAPI
vi.mock('../../utils/storage', () => ({
  storageAPI: {
    setWordCount: vi.fn(),
    getWordCount: vi.fn(() => 1),
  },
}));

// Mock wordChunking utility
vi.mock('../../utils/wordChunking', () => ({
  generateWordChunks: vi.fn((words: string[], wordsPerChunk: number) => {
    const chunks: {
      words: string[];
      startIndex: number;
      endIndex: number;
    }[] = [];
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      const chunkWords = words.slice(i, i + wordsPerChunk);
      chunks.push({
        words: chunkWords,
        startIndex: i,
        endIndex: Math.min(i + wordsPerChunk - 1, words.length - 1),
      });
    }
    return chunks;
  }),
}));

// Mock readerPreferences
vi.mock('./readerPreferences', () => ({
  persistPreferredWpm: vi.fn((wpm: number) => wpm),
  readPreferredWpm: vi.fn(() => 250),
}));

describe('useReadingSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates and sets words per chunk within range (1-5)', () => {
    const { result } = renderHook(() => useReadingSession());

    // Test valid values
    act(() => {
      result.current.setWordsPerChunk(3);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(3);
    expect(result.current.wordsPerChunk).toBe(3);

    act(() => {
      result.current.setWordsPerChunk(1);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(1);
    expect(result.current.wordsPerChunk).toBe(1);

    act(() => {
      result.current.setWordsPerChunk(5);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(5);
    expect(result.current.wordsPerChunk).toBe(5);
  });

  it('clamps values below 1 to 1', () => {
    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.setWordsPerChunk(0);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(1);
    expect(result.current.wordsPerChunk).toBe(1);

    act(() => {
      result.current.setWordsPerChunk(-5);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(1);
    expect(result.current.wordsPerChunk).toBe(1);
  });

  it('clamps values above 5 to 5', () => {
    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.setWordsPerChunk(6);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(5);
    expect(result.current.wordsPerChunk).toBe(5);

    act(() => {
      result.current.setWordsPerChunk(10);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(5);
    expect(result.current.wordsPerChunk).toBe(5);
  });

  it('handles decimal values by clamping to valid range', () => {
    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.setWordsPerChunk(2.5);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(2.5);
    expect(result.current.wordsPerChunk).toBe(2.5);

    act(() => {
      result.current.setWordsPerChunk(0.5);
    });
    expect(storageAPI.setWordCount).toHaveBeenCalledWith(1);
    expect(result.current.wordsPerChunk).toBe(1);
  });

  it('updates chunks when words per chunk changes during active session', () => {
    const { result } = renderHook(() => useReadingSession());

    // Start a reading session
    act(() => {
      result.current.startReading(6, [
        'word1',
        'word2',
        'word3',
        'word4',
        'word5',
        'word6',
      ]);
    });

    // Should have 6 chunks with 1 word per chunk initially
    expect(result.current.totalChunks).toBe(6);
    expect(result.current.chunks).toHaveLength(6);

    // Change to 2 words per chunk
    act(() => {
      result.current.setWordsPerChunk(2);
    });

    // Should now have 3 chunks with 2 words per chunk
    expect(result.current.totalChunks).toBe(3);
    expect(result.current.chunks).toHaveLength(3);
    expect(result.current.chunks[0].words).toEqual(['word1', 'word2']);
    expect(result.current.chunks[1].words).toEqual(['word3', 'word4']);
    expect(result.current.chunks[2].words).toEqual(['word5', 'word6']);
  });

  it('adjusts current chunk index when words per chunk changes', () => {
    const { result } = renderHook(() => useReadingSession());

    // Start a reading session
    act(() => {
      result.current.startReading(6, [
        'word1',
        'word2',
        'word3',
        'word4',
        'word5',
        'word6',
      ]);
    });

    // Manually advance chunks by dispatching advance actions
    act(() => {
      result.current.resumeReading();
    });
    // Wait for the timeout to advance chunks
    act(() => {
      vi.advanceTimersByTime(240); // 60000/250 = 240ms per word
    });

    act(() => {
      result.current.resumeReading();
    });
    act(() => {
      vi.advanceTimersByTime(240);
    });

    // Should be at chunk index 2 (word index 2)
    expect(result.current.currentChunkIndex).toBe(2);
    expect(result.current.currentWordIndex).toBe(2);

    // Change to 2 words per chunk
    act(() => {
      result.current.setWordsPerChunk(2);
    });

    // Current chunk index should be adjusted to floor(2 / 2) = 1
    expect(result.current.currentChunkIndex).toBe(1);
    expect(result.current.currentWordIndex).toBe(2);
  });
});

import { act, renderHook } from '@testing-library/react';

import { READER_PREFERENCE_STORAGE_KEY } from './readerConfig';
import { useReadingSession } from './useReadingSession';

describe('useReadingSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('tracks session lifecycle, derived metrics, and timer progress', () => {
    const { result } = renderHook(() => useReadingSession());

    expect(result.current.status).toBe('idle');
    expect(result.current.msPerWord).toBeCloseTo(240);
    expect(result.current.wordsRead).toBe(0);
    expect(result.current.progressPercent).toBe(0);

    act(() => {
      result.current.startReading(3, ['word1', 'word2', 'word3']);
    });

    expect(result.current.status).toBe('running');
    expect(result.current.totalWords).toBe(3);
    expect(result.current.startCount).toBe(1);
    expect(result.current.wordsRead).toBe(1);

    act(() => {
      vi.advanceTimersByTime(result.current.msPerWord);
    });

    expect(result.current.currentWordIndex).toBe(1);
    expect(result.current.elapsedMs).toBeCloseTo(result.current.msPerWord);
    expect(result.current.wordsRead).toBe(2);
    expect(result.current.progressPercent).toBeCloseTo((2 / 3) * 100);

    act(() => {
      result.current.pauseReading();
    });
    expect(result.current.status).toBe('paused');

    act(() => {
      result.current.resumeReading();
    });
    expect(result.current.status).toBe('running');

    act(() => {
      result.current.restartReading();
    });
    expect(result.current.restartCount).toBe(1);
    expect(result.current.currentWordIndex).toBe(0);

    act(() => {
      result.current.editText();
    });
    expect(result.current.status).toBe('idle');
    expect(result.current.totalWords).toBe(0);
    expect(result.current.elapsedMs).toBe(0);
  });

  it('persists selected WPM', () => {
    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.setSelectedWpm(300);
    });
    expect(result.current.selectedWpm).toBe(300);
    expect(localStorage.getItem(READER_PREFERENCE_STORAGE_KEY)).toBe('300');
  });

  it('cleans up scheduled timer on effect teardown', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.startReading(5, [
        'word1',
        'word2',
        'word3',
        'word4',
        'word5',
      ]);
    });

    act(() => {
      result.current.pauseReading();
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

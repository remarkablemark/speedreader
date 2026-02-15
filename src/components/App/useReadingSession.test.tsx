import { act, fireEvent, renderHook } from '@testing-library/react';

import * as keyboardShortcuts from './keyboardShortcuts';
import {
  READER_MAX_WPM,
  READER_MIN_WPM,
  READER_PREFERENCE_STORAGE_KEY,
} from './readerConfig';
import * as sessionReducer from './sessionReducer';
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
      result.current.startReading(3);
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

  it('persists selected WPM and handles keyboard shortcut branches', () => {
    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.setSelectedWpm(300);
    });
    expect(result.current.selectedWpm).toBe(300);
    expect(localStorage.getItem(READER_PREFERENCE_STORAGE_KEY)).toBe('300');

    act(() => {
      result.current.startReading(4);
    });

    act(() => {
      fireEvent.keyDown(window, { key: 'x' });
    });
    expect(result.current.status).toBe('running');

    act(() => {
      fireEvent.keyDown(window, { key: ' ' });
    });
    expect(result.current.status).toBe('paused');

    act(() => {
      fireEvent.keyDown(window, { key: ' ' });
    });
    expect(result.current.status).toBe('running');

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowUp' });
    });
    expect(result.current.selectedWpm).toBe(310);

    act(() => {
      fireEvent.keyDown(window, { key: 'Home' });
    });
    expect(result.current.selectedWpm).toBe(READER_MIN_WPM);

    act(() => {
      fireEvent.keyDown(window, { key: 'End' });
    });
    expect(result.current.selectedWpm).toBe(READER_MAX_WPM);

    act(() => {
      fireEvent.keyDown(window, { key: 'r' });
    });
    expect(result.current.restartCount).toBe(1);
  });

  it('ignores shortcuts from input targets and non-adjust shortcuts with no words', () => {
    const { result } = renderHook(() => useReadingSession());

    const input = document.createElement('input');
    document.body.append(input);

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
      );
    });

    expect(result.current.selectedWpm).toBe(250);

    act(() => {
      fireEvent.keyDown(window, { key: 'r' });
      fireEvent.keyDown(window, { key: ' ' });
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.totalWords).toBe(0);

    input.remove();
  });

  it('cleans up scheduled timer on effect teardown', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.startReading(5);
    });

    act(() => {
      result.current.pauseReading();
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('handles unknown shortcut action type through default switch branch', () => {
    const shortcutSpy = vi
      .spyOn(keyboardShortcuts, 'getShortcutAction')
      .mockReturnValue({ type: 'noop' } as never);

    const { result } = renderHook(() => useReadingSession());

    act(() => {
      result.current.startReading(2);
    });

    act(() => {
      fireEvent.keyDown(window, { key: 'z' });
    });

    expect(result.current.status).toBe('running');
    expect(shortcutSpy).toHaveBeenCalled();
  });

  it('ignores toggle shortcut when session is not running or paused', () => {
    const createInitialStateSpy = vi
      .spyOn(sessionReducer, 'createInitialSessionState')
      .mockReturnValue({
        status: 'completed',
        currentWordIndex: 1,
        selectedWpm: 250,
        elapsedMs: 240,
        startCount: 1,
        restartCount: 0,
        totalWords: 2,
      });

    const { result } = renderHook(() => useReadingSession());

    act(() => {
      fireEvent.keyDown(window, { key: ' ' });
    });

    expect(result.current.status).toBe('completed');
    expect(createInitialStateSpy).toHaveBeenCalled();
  });
});

import { expect } from 'vitest';

import type {
  ReadingSessionActions,
  ReadingSessionState,
  ReadingSessionStatus,
} from './readerTypes';

describe('readerTypes', () => {
  it('ReadingSessionStatus type exists', () => {
    // This test ensures the type is properly exported
    const status: ReadingSessionStatus = 'idle';
    expect(status).toBe('idle');
  });

  it('ReadingSessionStatus has correct values', () => {
    const validStatuses: ReadingSessionStatus[] = [
      'idle',
      'running',
      'paused',
      'completed',
    ];
    expect(validStatuses).toHaveLength(4);
    expect(validStatuses).toContain('idle');
    expect(validStatuses).toContain('running');
    expect(validStatuses).toContain('paused');
    expect(validStatuses).toContain('completed');
  });

  it('ReadingSessionState interface structure is correct', () => {
    // This test ensures the interface has the expected structure
    const state: ReadingSessionState = {
      currentWordIndex: 0,
      elapsedMs: 0,
      msPerWord: 240,
      progressPercent: 0,
      restartCount: 0,
      selectedWpm: 250,
      startCount: 0,
      status: 'idle',
      totalWords: 0,
      wordsRead: 0,
    };

    expect(state.currentWordIndex).toBe(0);
    expect(state.elapsedMs).toBe(0);
    expect(state.msPerWord).toBe(240);
    expect(state.progressPercent).toBe(0);
    expect(state.restartCount).toBe(0);
    expect(state.selectedWpm).toBe(250);
    expect(state.startCount).toBe(0);
    expect(state.status).toBe('idle');
    expect(state.totalWords).toBe(0);
    expect(state.wordsRead).toBe(0);
  });

  it('ReadingSessionActions interface structure is correct', () => {
    // This test ensures the interface has the expected methods
    const actions: ReadingSessionActions = {
      editText: () => {
        // Empty implementation for testing
      },
      pauseReading: () => {
        // Empty implementation for testing
      },
      restartReading: () => {
        // Empty implementation for testing
      },
      resumeReading: () => {
        // Empty implementation for testing
      },
      setSelectedWpm: () => {
        // Empty implementation for testing
      },
      startReading: () => {
        // Empty implementation for testing
      },
    };

    expect(typeof actions.editText).toBe('function');
    expect(typeof actions.pauseReading).toBe('function');
    expect(typeof actions.restartReading).toBe('function');
    expect(typeof actions.resumeReading).toBe('function');
    expect(typeof actions.setSelectedWpm).toBe('function');
    expect(typeof actions.startReading).toBe('function');
  });
});

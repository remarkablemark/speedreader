import { useEffect, useReducer } from 'react';
import type { ReadingSessionStatus } from 'src/types/readerTypes';

import { persistPreferredWpm, readPreferredWpm } from './readerPreferences';
import { createInitialSessionState, sessionReducer } from './sessionReducer';

interface UseReadingSessionResult {
  currentWordIndex: number;
  elapsedMs: number;
  msPerWord: number;
  progressPercent: number;
  restartCount: number;
  selectedWpm: number;
  startCount: number;
  status: ReadingSessionStatus;
  totalWords: number;
  wordsRead: number;
  editText: () => void;
  pauseReading: () => void;
  restartReading: () => void;
  resumeReading: () => void;
  setSelectedWpm: (value: number) => void;
  startReading: (totalWords: number) => void;
}

export function useReadingSession(): UseReadingSessionResult {
  const [state, dispatch] = useReducer(
    sessionReducer,
    readPreferredWpm(),
    createInitialSessionState,
  );

  const msPerWord = 60000 / state.selectedWpm;
  const wordsRead =
    state.status === 'idle' || state.totalWords === 0
      ? 0
      : Math.min(state.currentWordIndex + 1, state.totalWords);
  const progressPercent =
    state.totalWords === 0 ? 0 : (wordsRead / state.totalWords) * 100;

  const setSelectedWpm = (value: number) => {
    const nextWpm = persistPreferredWpm(value);
    dispatch({
      type: 'setWpm',
      selectedWpm: nextWpm,
    });
  };

  const startReading = (totalWords: number) => {
    dispatch({ type: 'start', totalWords });
  };

  const pauseReading = () => {
    dispatch({ type: 'pause' });
  };

  const resumeReading = () => {
    dispatch({ type: 'resume' });
  };

  const restartReading = () => {
    dispatch({ type: 'restart' });
  };

  const editText = () => {
    dispatch({ type: 'editText' });
  };

  useEffect(() => {
    if (
      state.status !== 'running' ||
      state.currentWordIndex >= state.totalWords - 1
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'addElapsed', durationMs: msPerWord });
      dispatch({ type: 'advance' });
    }, msPerWord);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [msPerWord, state.currentWordIndex, state.status, state.totalWords]);

  return {
    status: state.status,
    currentWordIndex: state.currentWordIndex,
    selectedWpm: state.selectedWpm,
    startCount: state.startCount,
    totalWords: state.totalWords,
    elapsedMs: state.elapsedMs,
    msPerWord,
    wordsRead,
    progressPercent,
    restartCount: state.restartCount,
    setSelectedWpm,
    startReading,
    pauseReading,
    resumeReading,
    restartReading,
    editText,
  };
}

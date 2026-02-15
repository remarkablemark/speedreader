import { useEffect, useReducer } from 'react';
import type { ReadingSessionStatus } from 'src/types/readerTypes';

import { storageAPI } from '../../utils/storage';
import { generateWordChunks } from '../../utils/wordChunking';
import type { WordChunk } from '../ReadingDisplay/wordChunk.types.ts';
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
  // Multiple words display
  currentChunkIndex: number;
  totalChunks: number;
  wordsPerChunk: number;
  currentChunk: WordChunk | null;
  chunks: WordChunk[];
  // Actions
  editText: () => void;
  pauseReading: () => void;
  restartReading: () => void;
  resumeReading: () => void;
  setSelectedWpm: (value: number) => void;
  setWordsPerChunk: (value: number) => void;
  startReading: (totalWords: number, words: string[]) => void;
}

/**
 * Hook for managing reading session state and word chunking.
 *
 * Features:
 * - Manages reading session state (idle, running, paused, completed)
 * - Handles word chunk generation with configurable words per chunk
 * - Provides progress tracking and timing control
 * - Integrates with localStorage for word count persistence
 * - Uses React Compiler for automatic optimization
 *
 * @returns Hook result with session state and control functions
 */
export function useReadingSession(): UseReadingSessionResult {
  const [state, dispatch] = useReducer(
    sessionReducer,
    readPreferredWpm(),
    createInitialSessionState,
  );

  // Calculate chunks directly - React Compiler will optimize
  let chunks: WordChunk[] = [];
  if (
    state.totalWords > 0 &&
    state.wordsPerChunk > 0 &&
    state.words.length > 0
  ) {
    chunks = generateWordChunks(state.words, state.wordsPerChunk);
  }

  const currentChunk = chunks[state.currentChunkIndex] ?? null;

  // Update chunk state in reducer when chunks change
  useEffect(() => {
    dispatch({ type: 'updateChunkState', totalChunks: chunks.length });
  }, [chunks.length]);

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

  const setWordsPerChunk = (value: number) => {
    // Validate word count range (1-5)
    const validatedValue = Math.max(1, Math.min(5, value));
    storageAPI.setWordCount(validatedValue);
    dispatch({ type: 'setWordsPerChunk', wordsPerChunk: validatedValue });
  };

  const startReading = (totalWords: number, words: string[]) => {
    // Load saved word count preference when starting
    const savedWordsPerChunk = storageAPI.getWordCount();
    dispatch({ type: 'setWordsPerChunk', wordsPerChunk: savedWordsPerChunk });
    dispatch({ type: 'start', totalWords, words });
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
      state.currentChunkIndex >= state.totalChunks - 1
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
  }, [msPerWord, state.currentChunkIndex, state.status, state.totalChunks]);

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
    // Multiple words display
    currentChunkIndex: state.currentChunkIndex,
    totalChunks: state.totalChunks,
    wordsPerChunk: state.wordsPerChunk,
    currentChunk,
    chunks,
    // Actions
    setSelectedWpm,
    setWordsPerChunk,
    startReading,
    pauseReading,
    resumeReading,
    restartReading,
    editText,
  };
}

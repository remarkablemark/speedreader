import type { ReadingSessionState } from 'src/types/readerTypes';

export interface SessionReducerState extends ReadingSessionState {
  startCount: number;
  restartCount: number;
  totalWords: number;
}

export type SessionReducerAction =
  | { type: 'start'; totalWords: number; words: string[] }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'restart' }
  | {
      type: 'setWpm';
      selectedWpm: number;
    }
  | { type: 'advance' }
  | { type: 'editText' }
  | { type: 'resetElapsed' }
  | { type: 'addElapsed'; durationMs: number }
  // Multiple words display actions
  | { type: 'setWordsPerChunk'; wordsPerChunk: number }
  | { type: 'updateChunkState'; totalChunks: number };

export function createInitialSessionState(
  selectedWpm: number,
): SessionReducerState {
  return {
    status: 'idle',
    currentWordIndex: 0,
    selectedWpm,
    elapsedMs: 0,
    startCount: 0,
    restartCount: 0,
    totalWords: 0,
    // Multiple words display defaults
    currentChunkIndex: 0,
    totalChunks: 0,
    wordsPerChunk: 1,
    words: [],
  };
}

export function sessionReducer(
  state: SessionReducerState,
  action: SessionReducerAction,
): SessionReducerState {
  switch (action.type) {
    case 'start': {
      return {
        ...state,
        status: 'running',
        currentWordIndex: 0,
        elapsedMs: 0,
        startCount: state.startCount + 1,
        restartCount: 0,
        totalWords: action.totalWords,
        words: action.words,
        // Reset chunk state when starting new session
        currentChunkIndex: 0,
      };
    }

    case 'pause': {
      if (state.status !== 'running') {
        return state;
      }

      return {
        ...state,
        status: 'paused',
      };
    }

    case 'resume': {
      if (state.status !== 'paused') {
        return state;
      }

      return {
        ...state,
        status: 'running',
      };
    }

    case 'restart': {
      if (
        state.totalWords === 0 ||
        (state.status !== 'running' &&
          state.status !== 'paused' &&
          state.status !== 'completed')
      ) {
        return state;
      }

      return {
        ...state,
        status: 'running',
        currentWordIndex: 0,
        currentChunkIndex: 0,
        elapsedMs: 0,
        restartCount: state.restartCount + 1,
      };
    }

    case 'setWpm': {
      return {
        ...state,
        selectedWpm: action.selectedWpm,
      };
    }

    case 'advance': {
      if (state.status !== 'running') {
        return state;
      }

      const nextChunkIndex = state.currentChunkIndex + 1;
      if (nextChunkIndex >= state.totalChunks) {
        return {
          ...state,
          status: 'completed',
          currentChunkIndex: Math.max(state.totalChunks - 1, 0),
          // Set word index to the last word
          currentWordIndex: Math.max(state.totalWords - 1, 0),
        };
      }

      // Calculate the word index for the start of the next chunk
      const nextWordIndex = nextChunkIndex * state.wordsPerChunk;

      return {
        ...state,
        currentChunkIndex: nextChunkIndex,
        currentWordIndex: Math.min(nextWordIndex, state.totalWords - 1),
      };
    }

    case 'editText': {
      return {
        ...state,
        status: 'idle',
        currentWordIndex: 0,
        currentChunkIndex: 0,
        elapsedMs: 0,
        totalWords: 0,
        words: [],
        totalChunks: 0,
      };
    }

    case 'resetElapsed': {
      return {
        ...state,
        elapsedMs: 0,
      };
    }

    case 'addElapsed': {
      return {
        ...state,
        elapsedMs: state.elapsedMs + action.durationMs,
      };
    }

    // Multiple words display actions
    case 'setWordsPerChunk': {
      return {
        ...state,
        wordsPerChunk: action.wordsPerChunk,
        // Reset chunk index when word count changes
        currentChunkIndex: Math.floor(
          state.currentWordIndex / action.wordsPerChunk,
        ),
      };
    }

    case 'updateChunkState': {
      return {
        ...state,
        totalChunks: action.totalChunks,
        currentChunkIndex: Math.floor(
          state.currentWordIndex / state.wordsPerChunk,
        ),
      };
    }

    default:
      return state;
  }
}

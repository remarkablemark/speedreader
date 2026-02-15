import {
  createInitialSessionState,
  sessionReducer,
  type SessionReducerState,
} from './sessionReducer';

function createRunningState(
  overrides: Partial<SessionReducerState> = {},
): SessionReducerState {
  return {
    ...createInitialSessionState(250),
    status: 'running',
    totalWords: 3,
    ...overrides,
  };
}

describe('sessionReducer', () => {
  it('creates initial idle state with selected WPM', () => {
    expect(createInitialSessionState(300)).toEqual({
      status: 'idle',
      currentWordIndex: 0,
      selectedWpm: 300,
      elapsedMs: 0,
      startCount: 0,
      restartCount: 0,
      totalWords: 0,
      // Multiple words display defaults
      currentChunkIndex: 0,
      totalChunks: 0,
      wordsPerChunk: 1,
    });
  });

  it('starts a session with deterministic defaults', () => {
    const started = sessionReducer(createInitialSessionState(250), {
      type: 'start',
      totalWords: 4,
    });

    expect(started).toMatchObject({
      status: 'running',
      currentWordIndex: 0,
      elapsedMs: 0,
      startCount: 1,
      restartCount: 0,
      totalWords: 4,
    });
  });

  it('handles pause and resume transitions only from valid states', () => {
    const running = createRunningState();
    const paused = sessionReducer(running, { type: 'pause' });
    expect(paused.status).toBe('paused');

    const resumed = sessionReducer(paused, { type: 'resume' });
    expect(resumed.status).toBe('running');

    const ignoredPause = sessionReducer(createInitialSessionState(250), {
      type: 'pause',
    });
    expect(ignoredPause.status).toBe('idle');

    const ignoredResume = sessionReducer(createInitialSessionState(250), {
      type: 'resume',
    });
    expect(ignoredResume.status).toBe('idle');
  });

  it('advances words and completes on final transition', () => {
    const running = createRunningState({ totalWords: 2, currentWordIndex: 0 });
    const afterFirstAdvance = sessionReducer(running, { type: 'advance' });
    expect(afterFirstAdvance.currentWordIndex).toBe(1);
    expect(afterFirstAdvance.status).toBe('running');

    const completed = sessionReducer(afterFirstAdvance, { type: 'advance' });
    expect(completed.status).toBe('completed');
    expect(completed.currentWordIndex).toBe(1);

    const ignoredAdvance = sessionReducer(createInitialSessionState(250), {
      type: 'advance',
    });
    expect(ignoredAdvance.status).toBe('idle');
  });

  it('returns current state for unknown action types', () => {
    const state = createRunningState();
    const nextState = sessionReducer(state, {
      type: 'unknown',
    } as never);

    expect(nextState).toBe(state);
  });

  it('restarts only from active/completed states and increments restart marker', () => {
    const restarted = sessionReducer(
      createRunningState({
        currentWordIndex: 2,
        elapsedMs: 500,
        restartCount: 1,
      }),
      { type: 'restart' },
    );

    expect(restarted).toMatchObject({
      status: 'running',
      currentWordIndex: 0,
      elapsedMs: 0,
      restartCount: 2,
    });

    const ignoredRestart = sessionReducer(createInitialSessionState(250), {
      type: 'restart',
    });
    expect(ignoredRestart.restartCount).toBe(0);

    const pausedRestart = sessionReducer(
      createRunningState({ status: 'paused', restartCount: 2 }),
      { type: 'restart' },
    );
    expect(pausedRestart.restartCount).toBe(3);
    expect(pausedRestart.status).toBe('running');

    const completedRestart = sessionReducer(
      createRunningState({ status: 'completed', restartCount: 3 }),
      { type: 'restart' },
    );
    expect(completedRestart.restartCount).toBe(4);
    expect(completedRestart.status).toBe('running');
  });

  it('updates WPM, elapsed time, and edit transition', () => {
    const running = createRunningState({ elapsedMs: 120, currentWordIndex: 1 });

    const withWpm = sessionReducer(running, {
      type: 'setWpm',
      selectedWpm: 300,
    });
    expect(withWpm.selectedWpm).toBe(300);

    const withElapsed = sessionReducer(withWpm, {
      type: 'addElapsed',
      durationMs: 240,
    });
    expect(withElapsed.elapsedMs).toBe(360);

    const resetElapsed = sessionReducer(withElapsed, { type: 'resetElapsed' });
    expect(resetElapsed.elapsedMs).toBe(0);

    const idle = sessionReducer(resetElapsed, { type: 'editText' });
    expect(idle).toMatchObject({
      status: 'idle',
      currentWordIndex: 0,
      totalWords: 0,
      elapsedMs: 0,
    });
  });
});

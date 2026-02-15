import { render, screen } from '@testing-library/react';

import App from '.';
import { useReadingSession } from './useReadingSession';

vi.mock('./useReadingSession', () => ({
  useReadingSession: vi.fn(),
}));

type ReadingSession = ReturnType<typeof useReadingSession>;

function createSession(
  overrides: Partial<ReadingSession> = {},
): ReadingSession {
  return {
    currentWordIndex: 0,
    elapsedMs: 0,
    msPerWord: 240,
    progressPercent: 0,
    restartCount: 0,
    selectedWpm: 250,
    startCount: 0,
    status: 'idle' as const,
    totalWords: 0,
    wordsRead: 0,
    editText: vi.fn(),
    pauseReading: vi.fn(),
    restartReading: vi.fn(),
    resumeReading: vi.fn(),
    setSelectedWpm: vi.fn(),
    startReading: vi.fn(),
    ...overrides,
  };
}

describe('App state-specific rendering', () => {
  const mockUseReadingSession = vi.mocked(useReadingSession);

  it('renders start button when status is idle', () => {
    mockUseReadingSession.mockReturnValue(createSession());

    render(<App />);

    expect(
      screen.getByRole('button', { name: /start reading/i }),
    ).toBeInTheDocument();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders paused controls and paused status text', () => {
    mockUseReadingSession.mockReturnValue(
      createSession({
        status: 'paused',
        totalWords: 5,
        wordsRead: 2,
        progressPercent: 40,
      }),
    );

    render(<App />);
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
  });
});

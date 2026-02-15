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

    expect(
      screen.queryByRole('button', { name: /pause/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
  });

  it('renders completion summary and completion marker when session is completed', () => {
    mockUseReadingSession.mockReturnValue(
      createSession({
        status: 'completed',
        totalWords: 3,
        wordsRead: 3,
        elapsedMs: 720,
      }),
    );

    render(<App />);

    expect(
      screen.getByRole('heading', { name: /session complete/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('session-completion-marker')).toBeInTheDocument();
  });

  it('renders empty current word when session index points outside tokenized input', () => {
    mockUseReadingSession.mockReturnValue(
      createSession({
        status: 'running',
        totalWords: 2,
        currentWordIndex: 10,
        wordsRead: 2,
        progressPercent: 100,
      }),
    );

    render(<App />);

    const currentWord = screen.getByRole('status');
    expect(currentWord).toHaveTextContent('');
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
});

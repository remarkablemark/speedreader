import { type ChangeEvent, type SyntheticEvent, useId, useState } from 'react';

import { READER_MAX_WPM, READER_MIN_WPM } from './readerConfig';
import { hasReadableText, tokenizeContent } from './tokenizeContent';
import { useReadingSession } from './useReadingSession';

export default function App() {
  const [rawText, setRawText] = useState('');
  const textAreaId = useId();
  const speedInputId = useId();
  const validationId = useId();

  const {
    currentWordIndex,
    elapsedMs,
    msPerWord,
    progressPercent,
    restartCount,
    selectedWpm,
    startCount,
    status,
    totalWords: sessionWordCount,
    wordsRead,
    editText,
    pauseReading,
    restartReading,
    resumeReading,
    setSelectedWpm,
    startReading,
  } = useReadingSession();

  const { totalWords, words } = tokenizeContent(rawText);
  const isInputValid = hasReadableText(rawText);
  const isSetupMode = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';
  const hasSessionWords = sessionWordCount > 0;
  const currentWord = hasSessionWords ? (words[currentWordIndex] ?? '') : '';

  const handleStartReading = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isInputValid) {
      return;
    }

    startReading(totalWords);
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(event.target.value);
  };

  const handleWpmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedWpm(Number.parseInt(event.target.value, 10));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl min-w-80 flex-col gap-8 p-4 text-center sm:p-6 md:p-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-balance text-slate-900 sm:text-4xl">
          Speed Reader
        </h1>
        <p className="text-sm text-slate-700 sm:text-base">
          Paste text, choose your pace, and read one word at a time.
        </p>
      </header>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <form className="space-y-4" onSubmit={handleStartReading}>
          {isSetupMode ? (
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-slate-900"
                htmlFor={textAreaId}
              >
                Session text
              </label>
              <textarea
                id={textAreaId}
                value={rawText}
                onChange={handleTextChange}
                className="min-h-56 w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-sm transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Paste text to begin your speed reading session."
                rows={10}
              />
              {!isInputValid ? (
                <p
                  className="text-sm text-rose-700"
                  id={validationId}
                  role="alert"
                >
                  Enter at least one readable word before starting.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-[48px] leading-[1.1] font-semibold tracking-wide text-slate-900 max-[480px]:min-h-[8.5rem] max-[480px]:text-[2rem]">
              <p aria-live="polite" aria-atomic="true" role="status">
                {currentWord}
              </p>
            </div>
          )}

          <div
            className="flex w-full items-end justify-center gap-2 overflow-x-auto pb-1 max-[480px]:gap-[0.4rem]"
            role="group"
            aria-label="Reading controls"
          >
            <div className="min-w-44 shrink-0">
              <label
                className="block text-xs font-medium text-slate-700"
                htmlFor={speedInputId}
              >
                Speed ({selectedWpm} WPM)
              </label>
              <input
                id={speedInputId}
                min={READER_MIN_WPM}
                max={READER_MAX_WPM}
                step={1}
                type="range"
                value={selectedWpm}
                onChange={handleWpmChange}
                aria-valuemin={READER_MIN_WPM}
                aria-valuemax={READER_MAX_WPM}
                aria-valuenow={selectedWpm}
              />
            </div>

            {isSetupMode ? (
              <button
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-sky-600 bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-700 hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 max-[480px]:px-[0.6rem] max-[480px]:py-[0.45rem] max-[480px]:text-[0.8rem]"
                disabled={!isInputValid}
                type="submit"
              >
                Start Reading
              </button>
            ) : (
              <>
                {isRunning ? (
                  <button
                    className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 max-[480px]:px-[0.6rem] max-[480px]:py-[0.45rem] max-[480px]:text-[0.8rem]"
                    onClick={pauseReading}
                    type="button"
                  >
                    Pause
                  </button>
                ) : null}
                {isPaused ? (
                  <button
                    className="inline-flex shrink-0 items-center justify-center rounded-md border border-sky-600 bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:border-sky-700 hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 max-[480px]:px-[0.6rem] max-[480px]:py-[0.45rem] max-[480px]:text-[0.8rem]"
                    onClick={resumeReading}
                    type="button"
                  >
                    Resume
                  </button>
                ) : null}
                <button
                  className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 max-[480px]:px-[0.6rem] max-[480px]:py-[0.45rem] max-[480px]:text-[0.8rem]"
                  onClick={restartReading}
                  type="button"
                >
                  Restart
                </button>
                <button
                  className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 max-[480px]:px-[0.6rem] max-[480px]:py-[0.45rem] max-[480px]:text-[0.8rem]"
                  onClick={editText}
                  type="button"
                >
                  Edit Text
                </button>
              </>
            )}
          </div>
        </form>

        {!isSetupMode ? (
          <div className="space-y-2 text-sm text-slate-700" aria-live="polite">
            <p>
              Progress: <strong>{wordsRead}</strong> /{' '}
              <strong>{sessionWordCount}</strong> ({' '}
              {Math.round(progressPercent)}%)
            </p>
            <p>
              Tempo: <strong>{selectedWpm} WPM</strong> ({Math.round(msPerWord)}{' '}
              ms/word)
            </p>
            <p>
              Status:{' '}
              <strong>
                {status === 'running'
                  ? 'Reading word ' +
                    String(wordsRead) +
                    ' of ' +
                    String(sessionWordCount)
                  : status}
              </strong>
            </p>
          </div>
        ) : null}

        {isCompleted ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <h2 className="font-semibold">Session complete</h2>
            <p>
              You read {wordsRead} words in {Math.round(elapsedMs)} ms.
            </p>
          </div>
        ) : null}

        <div
          className="sr-only"
          data-testid="start-latency-marker"
          data-start-count={startCount}
        />
        <div
          className="sr-only"
          data-testid="restart-marker"
          data-restart-count={restartCount}
        />
        {isCompleted ? (
          <div className="sr-only" data-testid="session-completion-marker" />
        ) : null}
      </section>
    </main>
  );
}

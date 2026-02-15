import { useState } from 'react';
import { ControlPanel } from 'src/components/ControlPanel';
import { ReadingDisplay } from 'src/components/ReadingDisplay';
import { SessionDetails } from 'src/components/SessionDetails';
import {
  hasReadableText,
  TextInput,
  tokenizeContent,
} from 'src/components/TextInput';

import { SessionCompletion } from '../SessionCompletion';
import { useReadingSession } from './useReadingSession';

export default function App() {
  const [rawText, setRawText] = useState('');

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

  const { words } = tokenizeContent(rawText);
  const isInputValid = hasReadableText(rawText);
  const isSetupMode = status === 'idle';
  const isCompleted = status === 'completed';
  const hasSessionWords = sessionWordCount > 0;
  const currentWord = hasSessionWords ? (words[currentWordIndex] ?? '') : '';

  const handleStartReading = (text: string) => {
    /* v8 ignore next -- @preserve */
    if (!isInputValid) {
      return;
    }

    const { totalWords } = tokenizeContent(text);
    startReading(totalWords);
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
        {isSetupMode ? (
          <div className="space-y-4">
            <TextInput
              value={rawText}
              onChange={setRawText}
              onSubmit={handleStartReading}
              isValid={isInputValid}
            />
          </div>
        ) : (
          <ReadingDisplay
            currentWord={currentWord}
            hasWords={hasSessionWords}
          />
        )}

        <ControlPanel
          selectedWpm={selectedWpm}
          onSpeedChange={setSelectedWpm}
          onStartReading={() => {
            handleStartReading(rawText);
          }}
          onPauseReading={pauseReading}
          onResumeReading={resumeReading}
          onRestartReading={restartReading}
          onEditText={editText}
          isInputValid={isInputValid}
          status={status}
        />

        {!isSetupMode ? (
          <SessionDetails
            wordsRead={wordsRead}
            totalWords={sessionWordCount}
            progressPercent={progressPercent}
            selectedWpm={selectedWpm}
            msPerWord={msPerWord}
          />
        ) : null}

        {isCompleted ? (
          <SessionCompletion wordsRead={wordsRead} elapsedMs={elapsedMs} />
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

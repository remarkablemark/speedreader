import { useState } from 'react';
import { ControlPanel } from 'src/components/ControlPanel';
import { ReadingDisplay } from 'src/components/ReadingDisplay';
import { SessionDetails } from 'src/components/SessionDetails';
import {
  hasReadableText,
  TextInput,
  tokenizeContent,
} from 'src/components/TextInput';
import { ThemeToggle } from 'src/components/ThemeToggle';
import { useTheme } from 'src/hooks/useTheme';

import { SessionCompletion } from '../SessionCompletion';
import { useReadingSession } from './useReadingSession';

export default function App() {
  const [rawText, setRawText] = useState('');
  const { theme, toggleTheme } = useTheme();

  const {
    currentWordIndex,
    elapsedMs,
    msPerWord,
    progressPercent,
    selectedWpm,
    status,
    totalWords,
    wordsRead,
    // Multiple words display
    currentChunk,
    wordsPerChunk,
    setWordsPerChunk,
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
  const hasSessionWords = totalWords > 0;
  const currentWord = hasSessionWords ? (words[currentWordIndex] ?? '') : '';

  const handleStartReading = (text: string) => {
    /* v8 ignore next -- @preserve */
    if (!isInputValid) {
      return;
    }

    const { totalWords, words } = tokenizeContent(text);
    startReading(totalWords, words);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl min-w-80 flex-col gap-8 p-4 text-center text-gray-900 transition-colors duration-300 sm:p-6 md:p-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-balance text-slate-900 sm:text-4xl dark:text-slate-100">
          Speed Reader
        </h1>
        <p className="text-sm text-slate-700 sm:text-base dark:text-slate-300">
          Paste text, choose your pace, and read one word at a time.
        </p>
      </header>

      <section className="space-y-6 rounded-2xl border border-slate-200 p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-gray-800 dark:shadow-lg">
        {isSetupMode ? (
          <TextInput
            value={rawText}
            onChange={setRawText}
            onSubmit={handleStartReading}
            isValid={isInputValid}
          />
        ) : (
          <ReadingDisplay
            currentWord={currentWord}
            currentChunk={currentChunk}
            wordsPerChunk={wordsPerChunk}
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
          wordsPerChunk={wordsPerChunk}
          onWordsPerChunkChange={setWordsPerChunk}
        />

        {!isSetupMode && (
          <SessionDetails
            wordsRead={wordsRead}
            totalWords={totalWords}
            progressPercent={progressPercent}
            msPerWord={msPerWord}
          />
        )}

        {isCompleted && (
          <SessionCompletion wordsRead={wordsRead} elapsedMs={elapsedMs} />
        )}
      </section>

      <ThemeToggle currentTheme={theme} onThemeToggle={toggleTheme} />
    </main>
  );
}

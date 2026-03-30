import type { ReadingDisplayProps } from './ReadingDisplay.types';

export function ReadingDisplay({
  currentWord,
  currentChunk,
  wordsPerChunk,
  hasWords,
}: ReadingDisplayProps) {
  // Display chunk text if available and wordsPerChunk > 1, otherwise fall back to single word
  const displayText =
    currentChunk && wordsPerChunk > 1
      ? currentChunk.text
      : hasWords
        ? currentWord
        : '';

  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-4 text-center text-5xl leading-tight font-semibold tracking-wide text-slate-900 max-sm:min-h-34 max-sm:text-3xl dark:border-slate-700 dark:bg-slate-700 dark:text-slate-50">
      <p
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className={wordsPerChunk > 1 ? 'break-words' : ''}
      >
        {displayText}
      </p>
    </div>
  );
}

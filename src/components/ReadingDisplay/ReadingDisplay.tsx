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
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-[48px] leading-[1.1] font-semibold tracking-wide text-slate-900 max-[480px]:min-h-[8.5rem] max-[480px]:text-[2rem] dark:border-slate-700 dark:bg-slate-700 dark:text-slate-50">
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

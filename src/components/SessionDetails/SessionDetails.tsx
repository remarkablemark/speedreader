import type { SessionDetailsProps } from './SessionDetails.types';

/**
 * SessionDetails component displaying progress and tempo statistics.
 * Renders collapsible details with session information.
 */
export function SessionDetails({
  wordsRead,
  totalWords,
  progressPercent,
  msPerWord,
}: SessionDetailsProps) {
  return (
    <details className="m-0">
      <summary className="mx-auto list-item w-fit cursor-pointer text-sm text-slate-400 dark:text-slate-300">
        Session details
      </summary>
      <div
        className="mt-2 space-y-2 text-slate-600 dark:text-slate-200"
        aria-live="polite"
      >
        <p>
          Progress: <strong>{wordsRead}</strong> / <strong>{totalWords}</strong>{' '}
          ({Math.round(progressPercent)}%)
        </p>

        <p>
          Tempo: <strong>{Math.round(msPerWord)}</strong> milliseconds/word
        </p>
      </div>
    </details>
  );
}

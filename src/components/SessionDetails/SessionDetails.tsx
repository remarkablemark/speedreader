import type { SessionDetailsProps } from './SessionDetails.types';

/**
 * SessionDetails component displaying progress and tempo statistics.
 * Renders collapsible details with session information.
 */
export function SessionDetails({
  wordsRead,
  totalWords,
  progressPercent,
  selectedWpm,
  msPerWord,
}: SessionDetailsProps) {
  return (
    <details className="m-0">
      <summary className="mx-auto list-item w-fit cursor-pointer text-sm text-slate-400">
        Session details
      </summary>
      <div className="mt-2 space-y-2" aria-live="polite">
        <p>
          Progress: <strong>{wordsRead}</strong> / <strong>{totalWords}</strong>{' '}
          ( {Math.round(progressPercent)}%)
        </p>
        <p>
          Tempo: <strong>{selectedWpm} WPM</strong> ({Math.round(msPerWord)}{' '}
          ms/word)
        </p>
      </div>
    </details>
  );
}

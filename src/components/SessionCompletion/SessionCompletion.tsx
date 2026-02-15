import type { SessionCompletionProps } from './SessionCompletion.types';

/**
 * SessionCompletion component displaying completion messaging.
 * Shows success message with word count and elapsed time.
 */
export function SessionCompletion({
  wordsRead,
  elapsedMs,
}: SessionCompletionProps) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <h2 className="font-semibold">Session complete</h2>
      <p>
        You read {wordsRead} words in {Math.round(elapsedMs)} ms.
      </p>
    </div>
  );
}

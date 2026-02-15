import type { ReadingDisplayProps } from './ReadingDisplay.types';

export function ReadingDisplay({ currentWord, hasWords }: ReadingDisplayProps) {
  const displayWord = hasWords ? currentWord : '';

  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-[48px] leading-[1.1] font-semibold tracking-wide text-slate-900 max-[480px]:min-h-[8.5rem] max-[480px]:text-[2rem]">
      <p aria-live="polite" aria-atomic="true" role="status">
        {displayWord}
      </p>
    </div>
  );
}

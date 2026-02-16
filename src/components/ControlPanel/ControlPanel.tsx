import { useId } from 'react';
import { Button } from 'src/components/Button';

import { READER_MAX_WPM, READER_MIN_WPM } from '../App/readerConfig';
import type { ControlPanelProps } from './ControlPanel.types';

/**
 * ControlPanel component containing speed slider, word count dropdown, and action buttons.
 *
 * Features:
 * - Speed slider for WPM control (100-1000 range)
 * - Word count dropdown for configuring words per chunk (1-5)
 * - State-dependent button visibility (Read/Pause/Play/Restart/Edit Text)
 * - Proper accessibility with semantic HTML and ARIA attributes
 */
export function ControlPanel({
  selectedWpm,
  onSpeedChange,
  onStartReading,
  onPauseReading,
  onResumeReading,
  onRestartReading,
  onEditText,
  isInputValid,
  status,
  wordsPerChunk,
  onWordsPerChunkChange,
}: ControlPanelProps) {
  const speedInputId = useId();
  const wordCountInputId = useId();

  const handleWpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number.parseInt(event.target.value, 10));
  };

  const handleWordsPerChunkChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onWordsPerChunkChange(Number.parseInt(event.target.value, 10));
  };

  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  return (
    <div
      className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-center sm:gap-1.5 sm:overflow-x-visible"
      role="group"
      aria-label="Reading controls"
    >
      <div className="sm:mr-4 sm:shrink-0">
        <label
          className="block text-xs font-medium text-slate-700 dark:text-slate-300"
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
          className="w-full sm:w-auto"
        />
      </div>

      <div className="sm:mr-4 sm:shrink-0">
        <label
          className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          htmlFor={wordCountInputId}
        >
          Word Count
        </label>
        <select
          id={wordCountInputId}
          value={wordsPerChunk}
          onChange={handleWordsPerChunkChange}
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-1.5">
        {isIdle ? (
          <Button
            variant="primary"
            disabled={!isInputValid}
            onClick={onStartReading}
            className="w-full sm:w-auto"
          >
            ▶ Read
          </Button>
        ) : (
          <>
            {isRunning && (
              <Button
                variant="secondary"
                onClick={onPauseReading}
                autoFocus
                className="flex-1 sm:flex-initial"
              >
                ⏸ Pause
              </Button>
            )}

            {isPaused && (
              <Button
                variant="primary"
                onClick={onResumeReading}
                autoFocus
                className="flex-1 sm:flex-initial"
              >
                ▶ Play
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={onRestartReading}
              className="flex-1 sm:flex-initial"
            >
              Restart
            </Button>

            <Button
              variant="secondary"
              onClick={onEditText}
              className="flex-1 sm:flex-initial"
            >
              Edit Text
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

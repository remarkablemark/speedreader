import { useId } from 'react';
import { Button } from 'src/components/Button';

import { READER_MAX_WPM, READER_MIN_WPM } from '../App/readerConfig';
import type { ControlPanelProps } from './ControlPanel.types';

/**
 * ControlPanel component containing speed slider and action buttons.
 * Handles state-dependent button visibility and speed control.
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
      className="flex w-full items-end justify-center gap-2 overflow-x-visible pb-1 max-[480px]:gap-[0.4rem]"
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

      <div className="min-w-32 shrink-0">
        <label
          className="block text-xs font-medium text-slate-700"
          htmlFor={wordCountInputId}
        >
          Word Count
        </label>
        <select
          id={wordCountInputId}
          value={wordsPerChunk}
          onChange={handleWordsPerChunkChange}
          className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
        >
          <option value={1}>1 word</option>
          <option value={2}>2 words</option>
          <option value={3}>3 words</option>
          <option value={4}>4 words</option>
          <option value={5}>5 words</option>
        </select>
      </div>

      {isIdle ? (
        <Button
          variant="primary"
          disabled={!isInputValid}
          onClick={onStartReading}
        >
          ▶ Read
        </Button>
      ) : (
        <>
          {isRunning && (
            <Button variant="secondary" onClick={onPauseReading} autoFocus>
              ⏸ Pause
            </Button>
          )}

          {isPaused && (
            <Button variant="primary" onClick={onResumeReading} autoFocus>
              ▶ Play
            </Button>
          )}

          <Button variant="secondary" onClick={onRestartReading}>
            Restart
          </Button>

          <Button variant="secondary" onClick={onEditText}>
            Edit Text
          </Button>
        </>
      )}
    </div>
  );
}

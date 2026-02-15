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
}: ControlPanelProps) {
  const speedInputId = useId();

  const handleWpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number.parseInt(event.target.value, 10));
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

      {isIdle ? (
        <Button
          variant="primary"
          disabled={!isInputValid}
          onClick={onStartReading}
        >
          Start Reading
        </Button>
      ) : (
        <>
          {isRunning && (
            <Button variant="secondary" onClick={onPauseReading} autoFocus>
              Pause
            </Button>
          )}

          {isPaused && (
            <Button variant="primary" onClick={onResumeReading} autoFocus>
              Resume
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

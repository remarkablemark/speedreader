import type { ChangeEvent } from 'react';
import type { ReadingSessionStatus } from 'src/types/readerTypes';

export interface ControlPanelProps {
  selectedWpm: number;
  onSpeedChange: (wpm: number) => void;
  onStartReading: () => void;
  onPauseReading: () => void;
  onResumeReading: () => void;
  onRestartReading: () => void;
  onEditText: () => void;
  isInputValid: boolean;
  status: ReadingSessionStatus;
}

export interface SpeedSliderProps {
  selectedWpm: number;
  onSpeedChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  minWpm: number;
  maxWpm: number;
}

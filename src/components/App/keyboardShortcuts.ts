import {
  READER_MAX_WPM,
  READER_MIN_WPM,
  READER_SPEED_STEP,
} from './readerConfig';

export type KeyboardShortcutAction =
  | { type: 'togglePlayback' }
  | { type: 'restart' }
  | { type: 'adjustWpm'; amount: number }
  | { type: 'setWpm'; value: number };

export function getShortcutAction(key: string): KeyboardShortcutAction | null {
  switch (key) {
    case ' ': {
      return { type: 'togglePlayback' };
    }
    case 'r':
    case 'R': {
      return { type: 'restart' };
    }
    case 'ArrowUp': {
      return {
        type: 'adjustWpm',
        amount: READER_SPEED_STEP,
      };
    }
    case 'ArrowDown': {
      return {
        type: 'adjustWpm',
        amount: -READER_SPEED_STEP,
      };
    }
    case 'Home': {
      return { type: 'setWpm', value: READER_MIN_WPM };
    }
    case 'End': {
      return { type: 'setWpm', value: READER_MAX_WPM };
    }
    default:
      return null;
  }
}

export function shouldHandleShortcut(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();
  return tagName !== 'input' && tagName !== 'textarea';
}

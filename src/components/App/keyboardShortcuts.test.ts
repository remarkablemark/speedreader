import { getShortcutAction, shouldHandleShortcut } from './keyboardShortcuts';
import {
  READER_MAX_WPM,
  READER_MIN_WPM,
  READER_SPEED_STEP,
} from './readerConfig';

describe('keyboardShortcuts', () => {
  it('maps supported keys to actions', () => {
    expect(getShortcutAction(' ')).toEqual({ type: 'togglePlayback' });
    expect(getShortcutAction('r')).toEqual({ type: 'restart' });
    expect(getShortcutAction('R')).toEqual({ type: 'restart' });
    expect(getShortcutAction('ArrowUp')).toEqual({
      type: 'adjustWpm',
      amount: READER_SPEED_STEP,
    });
    expect(getShortcutAction('ArrowDown')).toEqual({
      type: 'adjustWpm',
      amount: -READER_SPEED_STEP,
    });
    expect(getShortcutAction('Home')).toEqual({
      type: 'setWpm',
      value: READER_MIN_WPM,
    });
    expect(getShortcutAction('End')).toEqual({
      type: 'setWpm',
      value: READER_MAX_WPM,
    });
  });

  it('returns null for unsupported keys', () => {
    expect(getShortcutAction('x')).toBeNull();
  });

  it('skips shortcuts when focus is on input-like fields', () => {
    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    const button = document.createElement('button');

    expect(shouldHandleShortcut(input)).toBe(false);
    expect(shouldHandleShortcut(textarea)).toBe(false);
    expect(shouldHandleShortcut(button)).toBe(true);
    expect(shouldHandleShortcut(null)).toBe(true);
  });
});

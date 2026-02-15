import { expect, test } from 'vitest';

import {
  FLASH_WORD_BASE_FONT_PX,
  READER_DEFAULT_WPM,
  READER_MAX_WPM,
  READER_MIN_WPM,
  READER_PREFERENCE_STORAGE_KEY,
  READER_SPEED_STEP,
} from './readerConfig';

describe('readerConfig', () => {
  test('exports correct constants', () => {
    expect(READER_MIN_WPM).toBe(100);
    expect(READER_MAX_WPM).toBe(1000);
    expect(READER_DEFAULT_WPM).toBe(250);
    expect(READER_SPEED_STEP).toBe(10);
    expect(READER_PREFERENCE_STORAGE_KEY).toBe('speedreader.preferredWpm');
    expect(FLASH_WORD_BASE_FONT_PX).toBe(48);
  });

  test('constants have correct types', () => {
    expect(typeof READER_MIN_WPM).toBe('number');
    expect(typeof READER_MAX_WPM).toBe('number');
    expect(typeof READER_DEFAULT_WPM).toBe('number');
    expect(typeof READER_SPEED_STEP).toBe('number');
    expect(typeof READER_PREFERENCE_STORAGE_KEY).toBe('string');
    expect(typeof FLASH_WORD_BASE_FONT_PX).toBe('number');
  });

  test('constants have logical values', () => {
    expect(READER_MIN_WPM).toBeLessThan(READER_DEFAULT_WPM);
    expect(READER_DEFAULT_WPM).toBeLessThan(READER_MAX_WPM);
    expect(READER_SPEED_STEP).toBeGreaterThan(0);
    expect(FLASH_WORD_BASE_FONT_PX).toBeGreaterThan(0);
  });
});

import {
  READER_DEFAULT_WPM,
  READER_MAX_WPM,
  READER_MIN_WPM,
  READER_PREFERENCE_STORAGE_KEY,
} from './readerConfig';
import {
  clampWpm,
  persistPreferredWpm,
  readPreferredWpm,
} from './readerPreferences';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe('readerPreferences', () => {
  it('clamps values to allowed WPM range', () => {
    expect(clampWpm(READER_MIN_WPM - 1)).toBe(READER_MIN_WPM);
    expect(clampWpm(READER_MAX_WPM + 1)).toBe(READER_MAX_WPM);
    expect(clampWpm(333)).toBe(333);
  });

  it('reads default WPM when nothing is persisted', () => {
    const storage = new MemoryStorage();
    expect(readPreferredWpm(storage)).toBe(READER_DEFAULT_WPM);
  });

  it('reads and clamps persisted values', () => {
    const storage = new MemoryStorage();
    storage.setItem(READER_PREFERENCE_STORAGE_KEY, '2000');
    expect(readPreferredWpm(storage)).toBe(READER_MAX_WPM);
  });

  it('falls back to default WPM for invalid persisted values', () => {
    const storage = new MemoryStorage();
    storage.setItem(READER_PREFERENCE_STORAGE_KEY, 'not-a-number');
    expect(readPreferredWpm(storage)).toBe(READER_DEFAULT_WPM);
  });

  it('persists clamped values and returns normalized WPM', () => {
    const storage = new MemoryStorage();
    expect(persistPreferredWpm(99, storage)).toBe(READER_MIN_WPM);
    expect(storage.getItem(READER_PREFERENCE_STORAGE_KEY)).toBe(
      String(READER_MIN_WPM),
    );
  });
});

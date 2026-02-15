import {
  READER_DEFAULT_WPM,
  READER_MAX_WPM,
  READER_MIN_WPM,
  READER_PREFERENCE_STORAGE_KEY,
} from './readerConfig';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function clampWpm(value: number): number {
  return Math.min(READER_MAX_WPM, Math.max(READER_MIN_WPM, value));
}

export function readPreferredWpm(storage: StorageLike = localStorage): number {
  const storedValue = storage.getItem(READER_PREFERENCE_STORAGE_KEY);

  if (storedValue === null) {
    return READER_DEFAULT_WPM;
  }

  const parsedValue = Number.parseInt(storedValue, 10);
  if (Number.isNaN(parsedValue)) {
    return READER_DEFAULT_WPM;
  }

  return clampWpm(parsedValue);
}

export function persistPreferredWpm(
  value: number,
  storage: StorageLike = localStorage,
): number {
  const normalizedWpm = clampWpm(value);
  storage.setItem(READER_PREFERENCE_STORAGE_KEY, String(normalizedWpm));
  return normalizedWpm;
}

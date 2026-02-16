import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getHighContrastMode,
  getSystemTheme,
  loadThemePreference,
  saveThemePreference,
  validateThemePreference,
} from './theme';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      store = Object.keys(store).reduce<Record<string, string>>((acc, k) => {
        if (k !== key) {
          acc[k] = store[k];
        }
        return acc;
      }, {});
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const createMatchMediaMock = (matches: boolean) => ({
  matches,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe('getSystemTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return "light" when system prefers light mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => createMatchMediaMock(false)),
    });

    expect(getSystemTheme()).toBe('light');
  });

  it('should return "dark" when system prefers dark mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => createMatchMediaMock(true)),
    });

    expect(getSystemTheme()).toBe('dark');
  });
});

describe('getHighContrastMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false when high contrast mode is not active', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => createMatchMediaMock(false)),
    });

    expect(getHighContrastMode()).toBe(false);
  });

  it('should return true when high contrast mode is active', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => createMatchMediaMock(true)),
    });

    expect(getHighContrastMode()).toBe(true);
  });
});

describe('saveThemePreference', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should save theme preference to localStorage', () => {
    const result = saveThemePreference('dark');

    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'speedreader.theme',
      'dark',
    );
  });

  it('should save light theme preference', () => {
    const result = saveThemePreference('light');

    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'speedreader.theme',
      'light',
    );
  });

  it('should save system theme preference', () => {
    const result = saveThemePreference('system');

    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'speedreader.theme',
      'system',
    );
  });

  it('should return false when localStorage throws an error', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Storage quota exceeded');
    });

    const result = saveThemePreference('dark');

    expect(result).toBe(false);
  });
});

describe('loadThemePreference', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should load saved theme preference from localStorage', () => {
    localStorageMock.setItem('speedreader.theme', 'dark');

    const result = loadThemePreference();

    expect(result).toBe('dark');
  });

  it('should return null when no preference is stored', () => {
    const result = loadThemePreference();

    expect(result).toBeNull();
  });

  it('should return null when stored value is invalid', () => {
    localStorageMock.setItem('speedreader.theme', 'invalid');

    const result = loadThemePreference();

    expect(result).toBeNull();
  });

  it('should return null when localStorage throws an error', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Storage access denied');
    });

    const result = loadThemePreference();

    expect(result).toBeNull();
  });
});

describe('validateThemePreference', () => {
  it('should return true for valid "light" theme', () => {
    expect(validateThemePreference('light')).toBe(true);
  });

  it('should return true for valid "dark" theme', () => {
    expect(validateThemePreference('dark')).toBe(true);
  });

  it('should return true for valid "system" theme', () => {
    expect(validateThemePreference('system')).toBe(true);
  });

  it('should return false for invalid string', () => {
    expect(validateThemePreference('invalid')).toBe(false);
  });

  it('should return false for non-string values', () => {
    expect(validateThemePreference(123)).toBe(false);
    expect(validateThemePreference(null)).toBe(false);
    expect(validateThemePreference(undefined)).toBe(false);
    expect(validateThemePreference({})).toBe(false);
    expect(validateThemePreference([])).toBe(false);
  });
});

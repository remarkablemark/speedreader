import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTheme } from './useTheme';

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

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return createMatchMediaMock(false);
        }
        if (query === '(prefers-contrast: high)') {
          return createMatchMediaMock(false);
        }
        return createMatchMediaMock(false);
      }),
    });
  });

  it('should initialize with system preference when no stored preference exists', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.preference).toBe('system');
    expect(result.current.followingSystem).toBe(true);
  });

  it('should initialize with dark theme when system prefers dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('system');
  });

  it('should toggle theme from light to dark', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('dark');
    expect(result.current.followingSystem).toBe(false);
  });

  it('should toggle theme from dark to light', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.preference).toBe('light');
  });

  it('should set specific theme preference', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('dark');
    expect(result.current.followingSystem).toBe(false);
  });

  it('should set theme to system preference', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.preference).toBe('system');
    expect(result.current.followingSystem).toBe(true);
  });

  it('should detect high contrast mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-contrast: high)') {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.highContrastMode).toBe(true);
    expect(result.current.theme).toBe('light');
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerMock = vi.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: removeEventListenerMock,
        dispatchEvent: vi.fn(),
      })),
    });

    const { unmount } = renderHook(() => useTheme());

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalled();
  });
});

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

  it('should initialize with light theme when stored preference is light', () => {
    localStorageMock.setItem('speedreader.theme', 'light');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.preference).toBe('light');
    expect(result.current.followingSystem).toBe(false);
  });

  it('should initialize with dark theme when stored preference is dark', () => {
    localStorageMock.setItem('speedreader.theme', 'dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('dark');
    expect(result.current.followingSystem).toBe(false);
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

  it('should use system theme when high contrast mode is enabled during initialization', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return createMatchMediaMock(true); // System prefers dark
        }
        if (query === '(prefers-contrast: high)') {
          return createMatchMediaMock(true); // High contrast enabled
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    // During initialization, high contrast mode doesn't force light theme
    // It follows the system preference when preference is 'system'
    expect(result.current.highContrastMode).toBe(true);
    expect(result.current.theme).toBe('dark'); // Follows system preference during init
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

  it('should respond to system theme changes when following system', () => {
    const mediaQueryMock = createMatchMediaMock(false);
    const addEventListenerMock = vi.fn();
    mediaQueryMock.addEventListener = addEventListenerMock;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return mediaQueryMock;
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.followingSystem).toBe(true);

    // Simulate system theme change to dark
    mediaQueryMock.matches = true;
    const changeHandler = addEventListenerMock.mock.calls[0][1] as (
      event: Event,
    ) => void;
    act(() => {
      changeHandler(new Event('change'));
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should force light theme when high contrast mode is enabled during system theme changes', () => {
    const colorSchemeMediaQueryMock = createMatchMediaMock(false); // System prefers light initially
    const contrastMediaQueryMock = createMatchMediaMock(false); // High contrast disabled initially
    const addEventListenerMock = vi.fn();
    colorSchemeMediaQueryMock.addEventListener = addEventListenerMock;
    contrastMediaQueryMock.addEventListener = addEventListenerMock;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return colorSchemeMediaQueryMock;
        }
        if (query === '(prefers-contrast: high)') {
          return contrastMediaQueryMock;
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    // Initially should be light
    expect(result.current.theme).toBe('light');

    // Enable high contrast mode first
    contrastMediaQueryMock.matches = true;
    const contrastChangeHandler = addEventListenerMock.mock.calls[1][1] as (
      event: Event,
    ) => void;
    act(() => {
      contrastChangeHandler(new Event('change'));
    });

    expect(result.current.highContrastMode).toBe(true);
    expect(result.current.theme).toBe('light'); // Still light

    // Now change system theme to dark - should remain light due to high contrast
    colorSchemeMediaQueryMock.matches = true;
    const colorSchemeChangeHandler = addEventListenerMock.mock.calls[0][1] as (
      event: Event,
    ) => void;
    act(() => {
      colorSchemeChangeHandler(new Event('change'));
    });

    expect(result.current.theme).toBe('light'); // High contrast forces light even though system is dark
  });

  it('should use system theme when high contrast mode is disabled during system theme changes', () => {
    const colorSchemeMediaQueryMock = createMatchMediaMock(false); // System prefers light
    const contrastMediaQueryMock = createMatchMediaMock(true); // High contrast initially enabled
    const addEventListenerMock = vi.fn();
    colorSchemeMediaQueryMock.addEventListener = addEventListenerMock;
    contrastMediaQueryMock.addEventListener = addEventListenerMock;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return colorSchemeMediaQueryMock;
        }
        if (query === '(prefers-contrast: high)') {
          return contrastMediaQueryMock;
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    // Initially should be light due to high contrast
    expect(result.current.theme).toBe('light');

    // Disable high contrast mode
    contrastMediaQueryMock.matches = false;
    const contrastChangeHandler = addEventListenerMock.mock.calls[1][1] as (
      event: Event,
    ) => void;
    act(() => {
      contrastChangeHandler(new Event('change'));
    });

    expect(result.current.highContrastMode).toBe(false);
    expect(result.current.theme).toBe('light'); // Still light

    // Now change system theme to dark - should follow system since high contrast is disabled
    colorSchemeMediaQueryMock.matches = true;
    const colorSchemeChangeHandler = addEventListenerMock.mock.calls[0][1] as (
      event: Event,
    ) => void;
    act(() => {
      colorSchemeChangeHandler(new Event('change'));
    });

    expect(result.current.theme).toBe('dark'); // Should follow system theme now
  });

  it('should use newSystemTheme when high contrast mode is false during system theme changes', () => {
    const colorSchemeMediaQueryMock = createMatchMediaMock(false); // System prefers light initially
    const contrastMediaQueryMock = createMatchMediaMock(false); // High contrast disabled
    const addEventListenerMock = vi.fn();
    colorSchemeMediaQueryMock.addEventListener = addEventListenerMock;
    contrastMediaQueryMock.addEventListener = addEventListenerMock;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return colorSchemeMediaQueryMock;
        }
        if (query === '(prefers-contrast: high)') {
          return contrastMediaQueryMock;
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    // Initially should be light
    expect(result.current.theme).toBe('light');

    // Change system theme to dark - should follow system since high contrast is disabled
    colorSchemeMediaQueryMock.matches = true;
    const colorSchemeChangeHandler = addEventListenerMock.mock.calls[0][1] as (
      event: Event,
    ) => void;
    act(() => {
      colorSchemeChangeHandler(new Event('change'));
    });

    expect(result.current.theme).toBe('dark'); // Should follow newSystemTheme (dark)
  });

  it('should not respond to system theme changes when not following system', () => {
    const mediaQueryMock = createMatchMediaMock(false);
    const addEventListenerMock = vi.fn();
    mediaQueryMock.addEventListener = addEventListenerMock;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return mediaQueryMock;
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.followingSystem).toBe(false);

    // Simulate system theme change
    mediaQueryMock.matches = true;
    const changeHandler = addEventListenerMock.mock.calls[0][1] as (
      event: Event,
    ) => void;
    act(() => {
      changeHandler(new Event('change'));
    });

    expect(result.current.theme).toBe('dark'); // Should remain dark
  });

  it('should respond to high contrast mode changes', () => {
    const mediaQueryMock = createMatchMediaMock(false);
    const addEventListenerMock = vi.fn();
    mediaQueryMock.addEventListener = addEventListenerMock;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (query === '(prefers-contrast: high)') {
          return mediaQueryMock;
        }
        return createMatchMediaMock(false);
      }),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.highContrastMode).toBe(false);

    // Simulate high contrast mode change
    mediaQueryMock.matches = true;
    const changeHandler = addEventListenerMock.mock.calls[0][1] as (
      event: Event,
    ) => void;
    act(() => {
      changeHandler(new Event('change'));
    });

    expect(result.current.highContrastMode).toBe(true);
    expect(result.current.theme).toBe('light'); // High contrast forces light
  });
});

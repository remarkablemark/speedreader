# Quickstart: Dark Mode Implementation

**Feature**: Dark Mode  
**Date**: 2026-02-15  
**Phase**: 1 - Design

## Implementation Overview

This quickstart guide provides the step-by-step approach to implement dark mode functionality in the speed reader application. The implementation follows the React 19 + TypeScript 5 + Tailwind CSS 4 stack.

## Prerequisites

- React 19 with TypeScript 5 strict mode
- Tailwind CSS 4 configured with `class` dark mode strategy
- Vitest 4 for testing
- Existing component structure in `src/components/`

## Step 1: Configure Tailwind CSS Dark Mode

**Tailwind CSS v4** uses CSS-based configuration. Add dark mode variant to `src/index.css`:

```css
@import 'tailwindcss';

@theme {
  --color-*: initial;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cbd5e1;
  --color-slate-700: #334155;
  --color-slate-900: #0f172a;
}

@variant dark (&:where(.dark, .dark *));
```

This enables class-based dark mode where styles are applied when `.dark` class is present on an element or its ancestors.

## Step 2: Create Theme Types

Create `src/types/theme.ts`:

```typescript
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  effectiveTheme: 'light' | 'dark';
  userPreference: Theme;
  systemPreference: 'light' | 'dark' | 'no-preference';
  highContrastMode: boolean;
}
```

## Step 3: Implement Theme Utilities

Create `src/utils/theme.ts`:

```typescript
import type { Theme } from 'src/types/theme';

const THEME_STORAGE_KEY = 'speedreader.theme';

export const getSystemTheme = (): 'light' | 'dark' | 'no-preference' => {
  if (!window.matchMedia) return 'no-preference';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const getHighContrastMode = (): boolean => {
  if (!window.matchMedia) return false;

  return window.matchMedia('(prefers-contrast: high)').matches;
};

export const saveThemePreference = (theme: Theme): boolean => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
};

export const loadThemePreference = (): Theme | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) return null;

    return validateThemePreference(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const validateThemePreference = (data: unknown): data is Theme => {
  return typeof data === 'string' && ['light', 'dark', 'system'].includes(data);
};
```

## Step 4: Create useTheme Hook

Create `src/hooks/useTheme.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { Theme, ThemeState } from 'src/types/theme';
import {
  getSystemTheme,
  getHighContrastMode,
  saveThemePreference,
  loadThemePreference,
} from 'src/utils/theme';

const DEFAULT_PREFERENCE: Theme = 'system';

export const useTheme = () => {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    const stored = loadThemePreference();
    const systemTheme = getSystemTheme();
    const highContrast = getHighContrastMode();

    const preference = stored || DEFAULT_PREFERENCE;
    const effectiveTheme = highContrast
      ? 'light'
      : preference === 'system'
        ? systemTheme
        : preference;

    return {
      effectiveTheme,
      userPreference: preference,
      systemPreference: systemTheme,
      highContrastMode: highContrast,
    };
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setThemeState((prev) => {
        if (prev.userPreference !== 'system') return prev;

        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        const effectiveTheme = prev.highContrastMode ? 'light' : newSystemTheme;

        return {
          ...prev,
          systemPreference: newSystemTheme,
          effectiveTheme,
        };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for high contrast mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleChange = () => {
      setThemeState((prev) => {
        const highContrast = mediaQuery.matches;
        const effectiveTheme = highContrast
          ? 'light'
          : prev.userPreference === 'system'
            ? prev.systemPreference
            : prev.userPreference;

        return {
          ...prev,
          highContrastMode: highContrast,
          effectiveTheme,
        };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const newTheme = prev.effectiveTheme === 'light' ? 'dark' : 'light';

      saveThemePreference(newTheme);

      return {
        ...prev,
        effectiveTheme: newTheme,
        userPreference: newTheme,
      };
    });
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setThemeState((prev) => {
      saveThemePreference(theme);

      const effectiveTheme = prev.highContrastMode
        ? 'light'
        : theme === 'system'
          ? prev.systemPreference
          : theme;

      return {
        ...prev,
        effectiveTheme,
        userPreference: theme,
      };
    });
  }, []);

  return {
    theme: themeState.effectiveTheme,
    preference: themeState.userPreference,
    followingSystem: themeState.userPreference === 'system',
    toggleTheme,
    setTheme,
    highContrastMode: themeState.highContrastMode,
  };
};
```

## Step 5: Create ThemeToggle Component

Create `src/components/ThemeToggle/ThemeToggle.tsx`:

```typescript
import { buttonVariants } from 'src/components/Button';
import type { ThemeToggleProps } from './ThemeToggle.types';

export const ThemeToggle = ({
  currentTheme,
  onThemeToggle,
  className,
  disabled = false
}: ThemeToggleProps) => {
  const isDark = currentTheme === 'dark';
  const isSystem = currentTheme === 'system';

  const ariaLabel = `Toggle dark mode, currently ${
    isDark ? 'dark' : isSystem ? 'system' : 'light'
  } mode`;

  return (
    <button
      type="button"
      className={buttonVariants({
        variant: "ghost",
        size: "icon",
        className: `fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className || ''}`
      })}
      onClick={onThemeToggle}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
      {isDark ? (
        // Moon icon for dark mode
        <svg
          className="w-6 h-6 transition-transform duration-300 rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          className="w-6 h-6 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
};
```

Create `src/components/ThemeToggle/ThemeToggle.types.ts`:

```typescript
export interface ThemeToggleProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeToggle: () => void;
  className?: string;
  disabled?: boolean;
}
```

## Step 6: Integrate with App Component

Update `src/components/App/App.tsx`:

```typescript
import { useTheme } from 'src/hooks/useTheme';
import { ThemeToggle } from 'src/components/ThemeToggle';
import './App.css';

export const App = () => {
  const { theme, toggleTheme } = useTheme();

  // Apply theme to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Your existing app content */}

      <ThemeToggle
        currentTheme={theme}
        onThemeToggle={toggleTheme}
      />
    </div>
  );
};
```

## Step 7: Add Tests

Create `src/hooks/useTheme.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with system preference', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.preference).toBe('system');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('dark');
  });

  it('should load saved preference from localStorage', () => {
    const savedPreference = 'dark';

    localStorageMock.getItem.mockReturnValue(savedPreference);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('dark');
  });
});
```

## Step 8: Apply Theme Classes to Components

**Apply theme classes to components**:

```tsx
// Main App container
<main className="mx-auto flex min-h-screen w-full max-w-5xl min-w-80 flex-col gap-8 bg-white p-4 text-center text-gray-900 sm:p-6 md:p-10 dark:bg-gray-900 dark:text-gray-100">
  {/* Header text */}
  <header className="space-y-2">
    <h1 className="text-3xl font-semibold text-balance text-slate-900 sm:text-4xl dark:text-slate-100">
      Speed Reader
    </h1>
    <p className="text-sm text-slate-700 sm:text-base dark:text-slate-300">
      Paste text, choose your pace, and read one word at a time.
    </p>
  </header>

  {/* Card section */}
  <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-gray-800 dark:shadow-lg">
    {/* Content */}
  </section>

  {/* ThemeToggle */}
  <button className="hover:scale-105">{/* Toggle content */}</button>
</main>
```

## Verification Steps

1. **Build and Test**: Run `npm run build` and `npm run test:ci`
2. **Manual Testing**:
   - Toggle between themes
   - Refresh browser to verify persistence
   - Change system theme to verify automatic detection
3. **Accessibility Testing**:
   - Test keyboard navigation
   - Verify screen reader announcements
   - Check color contrast ratios

## Next Steps

After implementation, run `/speckit.tasks` to generate the detailed task breakdown for development.

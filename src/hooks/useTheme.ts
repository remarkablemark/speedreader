import { useCallback, useEffect, useState } from 'react';
import type { Theme, ThemeState } from 'src/types/theme';
import {
  getHighContrastMode,
  getSystemTheme,
  loadThemePreference,
  saveThemePreference,
} from 'src/utils/theme';

const DEFAULT_PREFERENCE: Theme = 'system';

const resolveEffectiveTheme = (
  systemTheme: 'light' | 'dark' | 'no-preference',
): 'light' | 'dark' => {
  return systemTheme === 'dark' ? 'dark' : 'light';
};

export const useTheme = () => {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    const stored = loadThemePreference();
    const systemTheme = getSystemTheme();
    const highContrast = getHighContrastMode();

    const preference = stored ?? DEFAULT_PREFERENCE;
    const effectiveTheme =
      highContrast || preference === 'system'
        ? resolveEffectiveTheme(systemTheme)
        : preference;

    return {
      effectiveTheme,
      userPreference: preference,
      systemPreference: systemTheme,
      highContrastMode: highContrast,
    };
  });

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
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleChange = () => {
      setThemeState((prev) => {
        const highContrast = mediaQuery.matches;
        const effectiveTheme =
          highContrast || prev.userPreference === 'system'
            ? resolveEffectiveTheme(prev.systemPreference)
            : prev.userPreference;

        return {
          ...prev,
          highContrastMode: highContrast,
          effectiveTheme,
        };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (themeState.effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.className = ''; // Ensure all classes are removed when switching to light
    }
  }, [themeState.effectiveTheme]);

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

      const effectiveTheme =
        prev.highContrastMode || theme === 'system'
          ? resolveEffectiveTheme(prev.systemPreference)
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

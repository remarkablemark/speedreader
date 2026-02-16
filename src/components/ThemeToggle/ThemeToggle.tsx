import type { ThemeToggleProps } from './ThemeToggle.types';

export const ThemeToggle = ({
  currentTheme,
  onThemeToggle,
  disabled = false,
}: ThemeToggleProps) => {
  const isDark = currentTheme === 'dark';
  const isSystem = currentTheme === 'system';

  const ariaLabel = `Toggle dark mode, currently ${
    isDark ? 'dark' : isSystem ? 'system' : 'light'
  } mode`;

  return (
    <button
      type="button"
      className="fixed right-6 bottom-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800"
      onClick={onThemeToggle}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
      {isDark ? (
        <svg
          className="h-6 w-6 rotate-180 transition-transform duration-300"
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
        <svg
          className="h-6 w-6 transition-transform duration-300"
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

import type { ThemeToggleProps } from './ThemeToggle.types';

export const ThemeToggle = ({
  currentTheme,
  onThemeToggle,
  disabled = false,
}: ThemeToggleProps) => {
  const ariaLabel = `Toggle theme, currently ${currentTheme} mode. Click to cycle to ${
    currentTheme === 'light'
      ? 'dark'
      : currentTheme === 'dark'
        ? 'system'
        : 'light'
  } mode`;

  const renderIcon = () => {
    switch (currentTheme) {
      case 'dark':
        return (
          <svg
            className="h-6 w-6 rotate-180 text-yellow-400 transition-transform duration-300 dark:text-yellow-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        );
      case 'system':
        return (
          <svg
            className="h-6 w-6 text-blue-500 transition-transform duration-300 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'light':
      default:
        return (
          <svg
            className="h-6 w-6 text-orange-500 transition-transform duration-300 dark:text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
    }
  };

  return (
    <button
      type="button"
      className="fixed right-6 bottom-6 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800"
      onClick={onThemeToggle}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
      {renderIcon()}
    </button>
  );
};

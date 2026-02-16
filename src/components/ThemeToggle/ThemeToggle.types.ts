export interface ThemeToggleProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeToggle: () => void;
  disabled?: boolean;
}

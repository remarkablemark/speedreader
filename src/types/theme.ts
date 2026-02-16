export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  effectiveTheme: 'light' | 'dark';
  userPreference: Theme;
  systemPreference: 'light' | 'dark' | 'no-preference';
  highContrastMode: boolean;
}

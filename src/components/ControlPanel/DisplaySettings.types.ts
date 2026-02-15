/**
 * DisplaySettings interface for word count preferences
 * Contains user preferences for words per chunk and grouping behavior
 */

export interface DisplaySettings {
  /** Number of words per chunk (1-5, default 1) */
  wordsPerChunk: number;

  /** Derived: whether multiple words mode is enabled */
  isMultipleWordsMode: boolean;
}

/**
 * Default display settings
 */
export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  wordsPerChunk: 1,
  isMultipleWordsMode: false,
} as const;

/**
 * Validation rules for DisplaySettings
 */
export const DisplaySettingsValidation = {
  /** Minimum words per chunk */
  MIN_WORDS: 1,

  /** Maximum words per chunk */
  MAX_WORDS: 5,
} as const;

/**
 * Type guard to validate DisplaySettings
 */
export function isValidDisplaySettings(
  settings: unknown,
): settings is DisplaySettings {
  if (!settings || typeof settings !== 'object') return false;

  const ds = settings as DisplaySettings;

  return (
    typeof ds.wordsPerChunk === 'number' &&
    ds.wordsPerChunk >= DisplaySettingsValidation.MIN_WORDS &&
    ds.wordsPerChunk <= DisplaySettingsValidation.MAX_WORDS &&
    typeof ds.isMultipleWordsMode === 'boolean'
  );
}

/**
 * Create DisplaySettings from word count
 */
export function createDisplaySettings(wordsPerChunk: number): DisplaySettings {
  const clampedWords = Math.max(
    DisplaySettingsValidation.MIN_WORDS,
    Math.min(DisplaySettingsValidation.MAX_WORDS, wordsPerChunk),
  );

  return {
    wordsPerChunk: clampedWords,
    isMultipleWordsMode: clampedWords > 1,
  };
}

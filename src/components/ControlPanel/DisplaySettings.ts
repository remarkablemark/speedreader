import type { DisplaySettings } from './DisplaySettings.types';
import {
  createDisplaySettings,
  DEFAULT_DISPLAY_SETTINGS,
  isValidDisplaySettings,
} from './DisplaySettings.types';

/**
 * DisplaySettings entity implementation
 * Manages user preferences for word count and display mode
 */

/**
 * Create default DisplaySettings
 * @returns Default DisplaySettings object
 */
export function createDefaultDisplaySettings(): DisplaySettings {
  return { ...DEFAULT_DISPLAY_SETTINGS };
}

/**
 * Create DisplaySettings with validation
 * @param wordsPerChunk - Number of words per chunk
 * @returns Valid DisplaySettings or default if invalid
 */
export function createValidDisplaySettings(
  wordsPerChunk: number,
): DisplaySettings {
  const settings = createDisplaySettings(wordsPerChunk);
  return isValidDisplaySettings(settings)
    ? settings
    : createDefaultDisplaySettings();
}

/**
 * Update DisplaySettings with new word count
 * @param currentSettings - Current DisplaySettings
 * @param newWordsPerChunk - New words per chunk value
 * @returns Updated DisplaySettings
 */
export function updateDisplaySettings(
  _currentSettings: DisplaySettings,
  newWordsPerChunk: number,
): DisplaySettings {
  return createValidDisplaySettings(newWordsPerChunk);
}

/**
 * Check if DisplaySettings represents multiple words mode
 * @param settings - DisplaySettings to check
 * @returns True if in multiple words mode
 */
export function isMultipleWordsMode(settings: DisplaySettings): boolean {
  return settings.wordsPerChunk > 1;
}

/**
 * Get display mode description
 * @param settings - DisplaySettings
 * @returns Human-readable description
 */
export function getDisplayModeDescription(settings: DisplaySettings): string {
  if (settings.wordsPerChunk === 1) {
    return 'Single word';
  }
  return `${String(settings.wordsPerChunk)} words`;
}

/**
 * Validate DisplaySettings against constraints
 * @param settings - DisplaySettings to validate
 * @returns Validation result
 */
export function validateDisplaySettings(settings: DisplaySettings): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isValidDisplaySettings(settings)) {
    errors.push('Invalid DisplaySettings structure');
    return { isValid: false, errors, warnings };
  }

  // Check mode consistency
  const expectedMode = settings.wordsPerChunk > 1;
  if (settings.isMultipleWordsMode !== expectedMode) {
    warnings.push('isMultipleWordsMode does not match wordsPerChunk value');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Serialize DisplaySettings to JSON
 * @param settings - DisplaySettings to serialize
 * @returns JSON string
 */
export function serializeDisplaySettings(settings: DisplaySettings): string {
  return JSON.stringify(settings);
}

/**
 * Deserialize DisplaySettings from JSON
 * @param json - JSON string to deserialize
 * @returns DisplaySettings or default if invalid
 */
export function deserializeDisplaySettings(json: string): DisplaySettings {
  try {
    const parsed = JSON.parse(json) as unknown;
    return isValidDisplaySettings(parsed)
      ? parsed
      : createDefaultDisplaySettings();
  } catch {
    return createDefaultDisplaySettings();
  }
}

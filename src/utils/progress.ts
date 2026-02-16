/**
 * Progress calculation utilities for reading sessions
 * Handles progress tracking for both single word and multiple words display
 */

/**
 * Calculate progress percentage based on current position
 * @param currentWordIndex - Current word position in original text
 * @param totalWords - Total number of words
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercentage(
  currentWordIndex: number,
  totalWords: number,
): number {
  if (totalWords === 0) return 0;
  if (currentWordIndex < 0) return 0;
  if (currentWordIndex >= totalWords) return 100;

  return Math.round((currentWordIndex / totalWords) * 100);
}

/**
 * Calculate reading progress metrics
 * @param currentWordIndex - Current word position
 * @param totalWords - Total words
 * @param currentChunkIndex - Current chunk position
 * @param totalChunks - Total chunks
 * @param wordsPerChunk - Words per chunk setting
 * @returns Progress metrics object
 */
export function calculateProgressMetrics(
  currentWordIndex: number,
  totalWords: number,
  currentChunkIndex: number,
  totalChunks: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _wordsPerChunk: number,
): {
  progressPercent: number;
  wordsRead: number;
  chunksRead: number;
  wordsRemaining: number;
  chunksRemaining: number;
  estimatedTimeRemaining: number; // in ms
} {
  const progressPercent = calculateProgressPercentage(
    currentWordIndex,
    totalWords,
  );
  const wordsRead = Math.min(currentWordIndex + 1, totalWords);
  const chunksRead = Math.min(currentChunkIndex + 1, totalChunks);
  const wordsRemaining = Math.max(0, totalWords - wordsRead);
  const chunksRemaining = Math.max(0, totalChunks - chunksRead);

  // Estimate time remaining (rough calculation)
  // This would typically use the current WPM setting
  const estimatedTimeRemaining = wordsRemaining * 60; // rough estimate in ms

  return {
    progressPercent,
    wordsRead,
    chunksRead,
    wordsRemaining,
    chunksRemaining,
    estimatedTimeRemaining,
  };
}

/**
 * Recalculate progress when word count changes during session
 * @param currentWordIndex - Current word position in original text
 * @param totalWords - Total words
 * @param newWordsPerChunk - New words per chunk setting
 * @returns New chunk index and progress
 */
export function recalculateProgressOnWordCountChange(
  currentWordIndex: number,
  totalWords: number,
  newWordsPerChunk: number,
): {
  newChunkIndex: number;
  progressPercent: number;
} {
  // Find which chunk contains the current word position
  const newChunkIndex = Math.floor(currentWordIndex / newWordsPerChunk);
  const progressPercent = calculateProgressPercentage(
    currentWordIndex,
    totalWords,
  );

  return {
    newChunkIndex: Math.max(0, newChunkIndex),
    progressPercent,
  };
}

/**
 * Format progress for display
 * @param progressPercent - Progress percentage
 * @param wordsRead - Words read
 * @param chunksRead - Chunks read
 * @param wordsPerChunk - Words per chunk setting
 * @returns Formatted progress string
 */
export function formatProgress(
  progressPercent: number,
  _wordsRead: number,
  chunksRead: number,
  wordsPerChunk: number,
): string {
  const unit = wordsPerChunk === 1 ? 'word' : 'chunk';
  return `${String(chunksRead)} ${unit} · ${String(progressPercent)}%`;
}

/**
 * Validate progress calculation parameters
 * @param currentWordIndex - Current word position
 * @param totalWords - Total words
 * @returns Validation result
 */
export function validateProgressParams(
  currentWordIndex: number,
  totalWords: number,
): { isValid: boolean; error?: string } {
  if (!Number.isInteger(currentWordIndex) || currentWordIndex < 0) {
    return {
      isValid: false,
      error: 'Current word index must be a non-negative integer',
    };
  }

  if (!Number.isInteger(totalWords) || totalWords < 0) {
    return {
      isValid: false,
      error: 'Total words must be a non-negative integer',
    };
  }

  if (currentWordIndex > totalWords) {
    return {
      isValid: false,
      error: 'Current word index cannot exceed total words',
    };
  }

  return { isValid: true };
}

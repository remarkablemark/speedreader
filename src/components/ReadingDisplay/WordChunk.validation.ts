import type { WordChunk } from './WordChunk.types';
import { isValidWordChunk, WordChunkValidation } from './WordChunk.types';

/**
 * Validate a single WordChunk
 * @param chunk - WordChunk to validate
 * @returns Validation result with details
 */
export function validateWordChunk(chunk: unknown): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isValidWordChunk(chunk)) {
    errors.push('Invalid WordChunk structure');
    return { isValid: false, errors, warnings };
  }

  // Check text length
  if (chunk.text.length > WordChunkValidation.MAX_TEXT_LENGTH) {
    warnings.push(
      `Text length (${String(chunk.text.length)}) exceeds recommended maximum (${String(WordChunkValidation.MAX_TEXT_LENGTH)})`,
    );
  }

  // Check word count
  if (chunk.words.length < WordChunkValidation.MIN_WORDS) {
    errors.push(
      `Word count (${String(chunk.words.length)}) below minimum (${String(WordChunkValidation.MIN_WORDS)})`,
    );
  }

  if (chunk.words.length > WordChunkValidation.MAX_WORDS) {
    errors.push(
      `Word count (${String(chunk.words.length)}) above maximum (${String(WordChunkValidation.MAX_WORDS)})`,
    );
  }

  // Check text consistency
  const expectedText = chunk.words.join(' ');
  if (chunk.text !== expectedText) {
    warnings.push('Text does not match joined words array');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate an array of WordChunks
 * @param chunks - Array of WordChunks to validate
 * @returns Validation result with details
 */
export function validateWordChunkArray(chunks: unknown[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(chunks)) {
    errors.push('Input must be an array');
    return { isValid: false, errors, warnings };
  }

  // Validate each chunk
  chunks.forEach((chunk, index) => {
    const validation = validateWordChunk(chunk);
    if (!validation.isValid) {
      errors.push(`Chunk ${String(index)}: ${validation.errors.join(', ')}`);
    }
    if (validation.warnings.length > 0) {
      warnings.push(
        `Chunk ${String(index)}: ${validation.warnings.join(', ')}`,
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create a valid WordChunk with validation
 * @param text - Combined text
 * @param words - Individual words
 * @returns Valid WordChunk or null if invalid
 */
export function createValidWordChunk(
  text: string,
  words: string[],
): WordChunk | null {
  const chunk: WordChunk = {
    text,
    words,
  };

  const validation = validateWordChunk(chunk);
  return validation.isValid ? chunk : null;
}

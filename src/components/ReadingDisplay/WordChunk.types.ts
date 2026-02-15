/**
 * WordChunk interface for multiple words display
 * Represents a group of 1-5 words to be displayed together
 */

export interface WordChunk {
  /** The combined text of all words in chunk */
  text: string;

  /** Individual words that make up this chunk */
  words: string[];
}

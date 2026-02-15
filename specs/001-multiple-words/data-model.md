# Data Model: Multiple Words Display

**Date**: 2025-02-15  
**Feature**: Multiple Words Display  
**Status**: Complete

## Core Entities

### WordChunk

Represents a group of 1-5 words to be displayed together.

```typescript
interface WordChunk {
  text: string; // The combined text of all words in chunk
  words: string[]; // Individual words that make up this chunk
  startIndex: number; // Index in original word array
  endIndex: number; // End index in original word array
  hasPunctuation: boolean; // Whether chunk contains punctuation
}
```

**Validation Rules**:

- `text` must not be empty
- `words` array length must be 1-5
- `startIndex` and `endIndex` must be within bounds of original text
- `startIndex` <= `endIndex`

### DisplaySettings

Contains user preferences for words per chunk and grouping behavior.

```typescript
interface DisplaySettings {
  wordsPerChunk: number; // 1-5, default 1
  isMultipleWordsMode: boolean; // Derived: wordsPerChunk > 1
}
```

**Validation Rules**:

- `wordsPerChunk` must be integer between 1 and 5
- `isMultipleWordsMode` is computed property (wordsPerChunk > 1)

### TokenizedContent

Extended to support word chunking in addition to individual word tokenization.

```typescript
interface TokenizedContent {
  words: string[]; // Original individual words
  totalWords: number; // Total word count
  chunks: WordChunk[]; // Generated word chunks
  totalChunks: number; // Total chunk count
}
```

**Validation Rules**:

- `words` array must not be empty if text provided
- `totalWords` must equal `words.length`
- `chunks` array length must be >= 1 if words exist
- `totalChunks` must equal `chunks.length`

## State Management

### Reading Session State

Extended from existing useReadingSession hook:

```typescript
interface ReadingSessionState {
  // Existing properties...
  currentWordIndex: number;
  elapsedMs: number;
  msPerWord: number;
  progressPercent: number;
  selectedWpm: number;
  status: 'idle' | 'reading' | 'paused' | 'completed';
  totalWords: number;
  wordsRead: number;

  // New properties for multiple words
  currentChunkIndex: number;
  chunksRead: number;
  totalChunks: number;
  displaySettings: DisplaySettings;
  currentChunk: WordChunk | null;
}
```

**State Transitions**:

- When `wordsPerChunk` changes: recalculate chunks and reset progress based on current word position
- When reading progresses: increment `currentChunkIndex` and `chunksRead`
- When session completes: status becomes 'completed'

## Data Flow

### Text Processing Pipeline

1. **Input Text** → `tokenizeContent()` → `TokenizedContent`
2. **TokenizedContent + DisplaySettings** → `generateWordChunks()` → `WordChunk[]`
3. **WordChunk[] + Timing** → Display with consistent duration

### Word Chunking Algorithm

```typescript
function generateWordChunks(
  words: string[],
  wordsPerChunk: number,
): WordChunk[] {
  const chunks: WordChunk[] = [];
  let currentChunkWords: string[] = [];
  let startIndex = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentChunkWords.push(word);

    // Check for natural break conditions
    const shouldBreak =
      currentChunkWords.length >= wordsPerChunk ||
      hasEndPunctuation(word) ||
      (currentChunkWords.length > 1 && hasComma(word));

    if (shouldBreak || i === words.length - 1) {
      chunks.push({
        text: currentChunkWords.join(' '),
        words: [...currentChunkWords],
        startIndex,
        endIndex: i,
        hasPunctuation: currentChunkWords.some((w) => hasPunctuation(w)),
      });

      currentChunkWords = [];
      startIndex = i + 1;
    }
  }

  return chunks;
}
```

### Progress Calculation

```typescript
function calculateProgress(
  currentWordIndex: number,
  totalWords: number,
  totalChunks: number,
  currentChunkIndex: number,
): number {
  if (totalWords === 0) return 0;

  // Progress based on word position for accuracy
  const wordProgress = (currentWordIndex / totalWords) * 100;

  // Alternative chunk-based progress for display
  const chunkProgress = (currentChunkIndex / totalChunks) * 100;

  return Math.round(wordProgress);
}
```

## Storage Schema

### localStorage Structure

```typescript
interface LocalStorageData {
  'speedreader.wordCount': number; // 1-5
}
```

**Validation**:

- Value must be integer between 1 and 5
- Invalid values default to 1
- Missing values default to 1

## Component Props Extensions

### ControlPanel Props

```typescript
interface ControlPanelProps {
  // Existing props...
  selectedWpm: number;
  onSpeedChange: (wpm: number) => void;
  status: ReadingStatus;

  // New props
  wordCount: number;
  onWordCountChange: (count: number) => void;
}
```

### ReadingDisplay Props

```typescript
interface ReadingDisplayProps {
  // Existing props...
  currentWord: string;
  hasWords: boolean;

  // Updated for multiple words
  currentChunk: WordChunk | null;
  displaySettings: DisplaySettings;
}
```

### SessionDetails Props

```typescript
interface SessionDetailsProps {
  // Existing props...
  wordsRead: number;
  totalWords: number;
  progressPercent: number;
  msPerWord: number;

  // Updated for multiple words
  chunksRead: number;
  totalChunks: number;
  displaySettings: DisplaySettings;
}
```

## Error Handling

### Validation Errors

- **Invalid word count**: Default to 1, log warning
- **Empty text**: Return empty TokenizedContent
- **localStorage unavailable**: Use in-memory defaults
- **Invalid progress values**: Clamp to 0-100 range

### Edge Cases

- **Text shorter than chunk size**: Single chunk with all words
- **Very long words**: Individual chunks for readability
- **Mixed punctuation**: Preserve with adjacent words
- **Session state changes**: Recalculate chunks and progress

## Performance Considerations

### Optimization Strategies

- **Memoization**: Cache generated chunks for same text + settings
- **Lazy calculation**: Generate chunks only when needed
- **Efficient algorithms**: O(n) complexity for chunking
- **Minimal re-renders**: Use React.memo for components

### Memory Management

- **Chunk cleanup**: Clear chunk data when session ends
- **State reset**: Proper cleanup on component unmount
- **localStorage limits**: Handle quota exceeded gracefully

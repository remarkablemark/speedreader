# Component API Contracts: Multiple Words Display

**Date**: 2025-02-15  
**Feature**: Multiple Words Display

## ControlPanel Component API

### Props

```typescript
interface ControlPanelProps {
  // Speed Control
  selectedWpm: number;
  onSpeedChange: (wpm: number) => void;

  // Word Count Control (NEW)
  wordCount: number;
  onWordCountChange: (count: number) => void;

  // Session Control
  status: 'idle' | 'reading' | 'paused' | 'completed';
  onStartReading: () => void;
  onPauseReading: () => void;
  onResumeReading: () => void;
  onRestartReading: () => void;
  onEditText: () => void;

  // Validation
  isInputValid: boolean;
}
```

### Events

```typescript
// Word count change events
onWordCountChange: (count: number) => void;
// Constraints: count must be 1-5
// Validation: Component should clamp invalid values
```

### Accessibility Requirements

- Dropdown must have proper label: "Word Count"
- Must support keyboard navigation (arrow keys, enter, escape)
- Must announce selection changes to screen readers
- Must maintain focus management

## ReadingDisplay Component API

### Props

```typescript
interface ReadingDisplayProps {
  // Content Display (UPDATED)
  currentChunk: WordChunk | null;
  displaySettings: DisplaySettings;

  // Legacy Support
  currentWord: string; // Derived from currentChunk.text[0] for single word mode
  hasWords: boolean; // Derived from currentChunk !== null
}
```

### WordChunk Structure

```typescript
interface WordChunk {
  text: string; // Display text (joined words)
  words: string[]; // Individual words
}
```

### Display Behavior

- **Single Word Mode** (wordCount = 1): Display as before
- **Multiple Words Mode** (wordCount > 1): Display chunk text with wrapping
- **Empty State**: Show placeholder when currentChunk is null
- **Overflow**: Text wraps within fixed display area

### Accessibility Requirements

- Use `aria-live="polite"` and `aria-atomic="true"` for content changes
- Announce chunk changes to screen readers
- Maintain readable text contrast and sizing
- Support text resizing

## SessionDetails Component API

### Props

```typescript
interface SessionDetailsProps {
  // Progress Tracking (UPDATED)
  wordsRead: number;
  totalWords: number;
  chunksRead: number;
  totalChunks: number;
  progressPercent: number;

  // Timing
  msPerWord: number; // Actually msPerChunk
  elapsedMs: number;

  // Display Settings (NEW)
  displaySettings: DisplaySettings;
}
```

### Display Logic

```typescript
// Terminology based on word count
const unit = displaySettings.wordsPerChunk === 1 ? 'word' : 'chunk';
const progressText = `${chunksRead} ${unit} · ${Math.round(progressPercent)}%`;
```

### Accessibility Requirements

- Dynamic terminology updates must be announced
- Progress information must be perceivable
- Use semantic markup for progress display

## useReadingSession Hook API

### Return Value

```typescript
interface UseReadingSessionReturn {
  // Existing State
  currentWordIndex: number;
  elapsedMs: number;
  msPerWord: number;
  progressPercent: number;
  selectedWpm: number;
  status: ReadingStatus;
  totalWords: number;
  wordsRead: number;

  // New State
  currentChunkIndex: number;
  chunksRead: number;
  totalChunks: number;
  displaySettings: DisplaySettings;
  currentChunk: WordChunk | null;

  // Actions
  editText: () => void;
  pauseReading: () => void;
  restartReading: () => void;
  resumeReading: () => void;
  setSelectedWpm: (wpm: number) => void;
  startReading: (totalWords: number) => void;
  setWordCount: (count: number) => void; // NEW
}
```

### New Actions

```typescript
setWordCount: (count: number) => void;
// Behavior: Updates displaySettings.wordsPerChunk
// Side effects: Recalculates chunks, updates progress
// Validation: Clamps count to 1-5 range
// Persistence: Saves to localStorage
```

## TextInput Component API

### Updated Behavior

```typescript
interface TextInputProps {
  // Existing props unchanged
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  isValid: boolean;
  disabled?: boolean;
}
```

### Tokenization Enhancement

```typescript
// Extended tokenizeContent function
interface TokenizedContent {
  words: string[];
  totalWords: number;
  chunks: WordChunk[]; // NEW
  totalChunks: number; // NEW
}
```

## Storage API

### localStorage Interface

```typescript
interface StorageAPI {
  getWordCount(): number;
  setWordCount(count: number): void;
  removeWordCount(): void;
}
```

### Implementation

```typescript
const WORD_COUNT_KEY = 'speedreader.wordCount';

export const storageAPI: StorageAPI = {
  getWordCount(): number {
    try {
      const value = localStorage.getItem(WORD_COUNT_KEY);
      return value ? Math.max(1, Math.min(5, parseInt(value, 10))) : 1;
    } catch {
      return 1; // Default on error
    }
  },

  setWordCount(count: number): void {
    try {
      const clampedCount = Math.max(1, Math.min(5, count));
      localStorage.setItem(WORD_COUNT_KEY, clampedCount.toString());
    } catch {
      // Silently fail on quota exceeded
    }
  },

  removeWordCount(): void {
    try {
      localStorage.removeItem(WORD_COUNT_KEY);
    } catch {
      // Silently fail
    }
  },
};
```

## Error Handling Contracts

### Validation Rules

```typescript
interface ValidationRules {
  wordCount: {
    min: 1;
    max: 5;
    default: 1;
  };
  textContent: {
    minLength: 1;
    maxLength: 1000000; // 1MB text limit
  };
  timing: {
    minWpm: 50;
    maxWpm: 1000;
  };
}
```

### Error Types

```typescript
interface AppError {
  code: 'INVALID_WORD_COUNT' | 'STORAGE_ERROR' | 'TEXT_TOO_LARGE';
  message: string;
  recoverable: boolean;
  defaultValue?: any;
}
```

## Performance Contracts

### Response Time Requirements

- **UI Updates**: <100ms from user action to visual feedback
- **Text Processing**: <50ms for typical article length (1000 words)
- **Storage Operations**: <10ms for localStorage access
- **Progress Calculation**: <5ms for recalculation

### Memory Constraints

- **Chunk Data**: <1MB for typical articles
- **Component State**: <100KB per component
- **Total Feature Overhead**: <5MB additional memory

## Testing Contracts

### Unit Test Requirements

- All component props variations
- Edge cases (empty text, single word, very long words)
- Error conditions (localStorage unavailable, invalid inputs)
- Accessibility behavior (keyboard navigation, screen readers)

### Integration Test Requirements

- End-to-end reading sessions with word count changes
- Progress recalculation accuracy
- Settings persistence across sessions
- Cross-browser compatibility

### Performance Test Requirements

- Large text processing (10,000+ words)
- Rapid word count changes
- Memory usage monitoring
- Frame rate stability during reading

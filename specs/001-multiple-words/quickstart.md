# Quickstart Guide: Multiple Words Display

**Date**: 2025-02-15  
**Feature**: Multiple Words Display

## Overview

This guide helps developers understand and implement the Multiple Words Display feature for the Speed Reader application. The feature allows users to read 1-5 words simultaneously instead of single words, with intelligent grouping and consistent timing.

## Key Concepts

### Word Chunks

- **Chunk**: Group of 1-5 words displayed together
- **Natural Grouping**: Prioritizes punctuation and phrase boundaries
- **Consistent Timing**: Same duration per chunk regardless of word count

### Display Modes

- **Single Word Mode** (word count = 1): Traditional speed reading
- **Multiple Words Mode** (word count = 2-5): Chunk-based reading

## Implementation Steps

### 1. Extend ControlPanel Component

```typescript
// src/components/ControlPanel/ControlPanel.tsx
import { storageAPI } from 'src/utils/storage';

export function ControlPanel({
  wordCount,
  onWordCountChange,
  // ... other props
}: ControlPanelProps) {
  const handleWordCountChange = (count: number) => {
    const clampedCount = Math.max(1, Math.min(5, count));
    onWordCountChange(clampedCount);
    storageAPI.setWordCount(clampedCount);
  };

  return (
    <div className="space-y-4">
      {/* Existing WPM slider */}

      {/* NEW: Word Count dropdown */}
      <div>
        <label htmlFor="word-count" className="block text-sm font-medium">
          Word Count
        </label>
        <select
          id="word-count"
          value={wordCount}
          onChange={(e) => handleWordCountChange(parseInt(e.target.value, 10))}
          className="w-full rounded-md border border-slate-300 bg-white p-2"
        >
          <option value="1">1 word</option>
          <option value="2">2 words</option>
          <option value="3">3 words</option>
          <option value="4">4 words</option>
          <option value="5">5 words</option>
        </select>
      </div>

      {/* Existing controls */}
    </div>
  );
}
```

### 2. Update ReadingDisplay Component

```typescript
// src/components/ReadingDisplay/ReadingDisplay.tsx
export function ReadingDisplay({
  currentChunk,
  displaySettings
}: ReadingDisplayProps) {
  const displayText = currentChunk?.text || '';
  const isMultipleWords = displaySettings.wordsPerChunk > 1;

  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className={`text-center font-semibold tracking-wide text-slate-900 ${
          isMultipleWords ? 'text-[2rem] leading-[1.3]' : 'text-[3rem] leading-[1.1]'
        }`}
      >
        {displayText}
      </p>
    </div>
  );
}
```

### 3. Extend Word Tokenization

```typescript
// src/components/TextInput/tokenizeContent.ts
export function generateWordChunks(
  words: string[],
  wordsPerChunk: number
): WordChunk[] {
  const chunks: WordChunk[] = [];
  let currentChunkWords: string[] = [];
  let startIndex = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentChunkWords.push(word);

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
        hasPunctuation: currentChunkWords.some(w => hasPunctuation(w))
      });

      currentChunkWords = [];
      startIndex = i + 1;
    }
  }

  return chunks;
}

export function tokenizeContent(rawText: string): TokenizedContent {
  // Existing tokenization logic...
  const words = /* ... */;

  return {
    words,
    totalWords: words.length,
    chunks: [], // Will be populated by useReadingSession
    totalChunks: 0
  };
}
```

### 4. Update useReadingSession Hook

```typescript
// src/components/App/useReadingSession.ts
export function useReadingSession() {
  const [wordCount, setWordCount] = useState(() => storageAPI.getWordCount());

  const displaySettings = useMemo(
    () => ({
      wordsPerChunk: wordCount,
      isMultipleWordsMode: wordCount > 1,
    }),
    [wordCount],
  );

  // Generate chunks when text or word count changes
  const chunks = useMemo(() => {
    if (!words.length) return [];
    return generateWordChunks(words, wordCount);
  }, [words, wordCount]);

  // Calculate current chunk
  const currentChunk = useMemo(() => {
    return chunks[currentChunkIndex] || null;
  }, [chunks, currentChunkIndex]);

  // Handle word count changes during session
  const handleWordCountChange = useCallback(
    (newCount: number) => {
      setWordCount(newCount);

      // Recalculate progress based on current word position
      if (status === 'reading' || status === 'paused') {
        const currentWordPosition = currentWordIndex;
        const newChunks = generateWordChunks(words, newCount);
        const newChunkIndex = newChunks.findIndex(
          (chunk) =>
            currentWordPosition >= chunk.startIndex &&
            currentWordPosition <= chunk.endIndex,
        );

        if (newChunkIndex >= 0) {
          setCurrentChunkIndex(newChunkIndex);
          setChunks(newChunks.length);
        }
      }
    },
    [currentWordIndex, status, words],
  );

  return {
    // Existing returns...
    currentChunk,
    chunks,
    totalChunks: chunks.length,
    displaySettings,
    setWordCount: handleWordCountChange,
  };
}
```

### 5. Update SessionDetails Component

```typescript
// src/components/SessionDetails/SessionDetails.tsx
export function SessionDetails({
  chunksRead,
  totalChunks,
  displaySettings,
  // ... other props
}: SessionDetailsProps) {
  const unit = displaySettings.wordsPerChunk === 1 ? 'word' : 'chunk';

  return (
    <div className="space-y-2 text-sm text-slate-600">
      <div>
        {chunksRead} {unit} · {Math.round(progressPercent)}%
      </div>
      <div>
        {formatTime(msPerWord)} per {unit}
      </div>
      {/* Other details */}
    </div>
  );
}
```

## Testing Implementation

### Unit Tests

```typescript
// src/components/ControlPanel/ControlPanel.test.tsx
describe('ControlPanel', () => {
  it('should render word count dropdown', () => {
    render(<ControlPanel wordCount={3} onWordCountChange={vi.fn()} />);
    expect(screen.getByLabelText('Word Count')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  it('should clamp word count to valid range', () => {
    const onWordCountChange = vi.fn();
    render(<ControlPanel wordCount={10} onWordCountChange={onWordCountChange} />);

    fireEvent.change(screen.getByLabelText('Word Count'), { target: { value: '10' } });
    expect(onWordCountChange).toHaveBeenCalledWith(5); // Clamped to max
  });
});
```

### Integration Tests

```typescript
// src/components/App/App.test.tsx
describe('Multiple Words Integration', () => {
  it('should maintain progress when changing word count', () => {
    const { getByLabelText, getByText } = render(<App />);

    // Start reading session
    fireEvent.change(getByLabelText('Session text'), {
      target: { value: 'The quick brown fox jumps over the lazy dog' }
    });
    fireEvent.click(getByText('Start Reading'));

    // Change word count during session
    fireEvent.change(getByLabelText('Word Count'), { target: { value: '3' } });

    // Progress should be recalculated
    expect(getByText(/word/)).toBeInTheDocument(); // Should update terminology
  });
});
```

## Accessibility Implementation

### Keyboard Navigation

```typescript
// Ensure dropdown supports keyboard
<select
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      // Handle escape
    }
  }}
  aria-describedby="word-count-help"
>
  {/* Options */}
</select>
<div id="word-count-help" className="sr-only">
  Select number of words to display simultaneously
</div>
```

### Screen Reader Support

```typescript
// Announce changes to screen readers
useEffect(() => {
  if (previousWordCount !== wordCount) {
    const announcement = `Word count changed to ${wordCount}`;
    // Use live region for announcement
  }
}, [wordCount, previousWordCount]);
```

## Performance Optimizations

### Memoization

```typescript
// Memoize expensive operations
const chunks = useMemo(() => {
  return generateWordChunks(words, wordCount);
}, [words, wordCount]);

const displaySettings = useMemo(
  () => ({
    wordsPerChunk: wordCount,
    isMultipleWordsMode: wordCount > 1,
  }),
  [wordCount],
);
```

### Debounced Storage

```typescript
// Debounce localStorage writes
const debouncedSaveWordCount = useMemo(
  () => debounce(storageAPI.setWordCount, 300),
  [],
);
```

## Common Issues and Solutions

### Issue: Progress calculation incorrect after word count change

**Solution**: Recalculate progress based on current word position in original text, not chunk index.

### Issue: Text wrapping affects readability

**Solution**: Use CSS `text-wrap: balance` and appropriate line-height for multi-word chunks.

### Issue: localStorage quota exceeded

**Solution**: Wrap localStorage operations in try-catch and gracefully fallback to defaults.

## Debugging Tips

1. **Check chunk generation**: Log generated chunks to verify grouping logic
2. **Verify timing**: Ensure msPerChunk remains constant regardless of word count
3. **Test edge cases**: Single word, very long words, punctuation-heavy text
4. **Monitor performance**: Use React DevTools to check for unnecessary re-renders

## Next Steps

1. Run full test suite: `npm run test:ci`
2. Check accessibility with screen reader
3. Test cross-browser compatibility
4. Verify localStorage persistence
5. Performance testing with large texts

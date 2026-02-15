# Data Model: Component Refactoring

**Date**: 2026-02-14  
**Scope**: Component interfaces and shared types for extracted components

## Component Interfaces

### Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}
```

### TextInput Component

```typescript
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  isValid: boolean;
  disabled?: boolean;
}
```

### ReadingDisplay Component

```typescript
interface ReadingDisplayProps {
  currentWord: string;
  hasWords: boolean;
}
```

### ControlPanel Component

```typescript
interface ControlPanelProps {
  selectedWpm: number;
  onSpeedChange: (wpm: number) => void;
  onStartReading: () => void;
  onPauseReading: () => void;
  onResumeReading: () => void;
  onRestartReading: () => void;
  onEditText: () => void;
  isInputValid: boolean;
  status: ReadingSessionStatus;
}
```

### SessionDetails Component

```typescript
interface SessionDetailsProps {
  wordsRead: number;
  totalWords: number;
  progressPercent: number;
  msPerWord: number;
}
```

### SessionCompletion Component

```typescript
interface SessionCompletionProps {
  wordsRead: number;
  elapsedMs: number;
}
```

## Shared Types (src/types/readerTypes.ts)

```typescript
// Reading session states
type ReadingSessionStatus = 'idle' | 'running' | 'paused' | 'completed';

// Reading session data
interface ReadingSessionState {
  currentWordIndex: number;
  elapsedMs: number;
  msPerWord: number;
  progressPercent: number;
  restartCount: number;
  selectedWpm: number;
  startCount: number;
  status: ReadingSessionStatus;
  totalWords: number;
  wordsRead: number;
}

// Reading session actions
interface ReadingSessionActions {
  editText: () => void;
  pauseReading: () => void;
  restartReading: () => void;
  resumeReading: () => void;
  setSelectedWpm: (wpm: number) => void;
  startReading: (totalWords: number) => void;
}

// Tokenized content
interface TokenizedContent {
  totalWords: number;
  words: string[];
}

// Reader configuration
interface ReaderConfig {
  minWpm: number;
  maxWpm: number;
}
```

## Component Relationships

```
App (Container)
├── TextInput (Form)
│   └── Button (primary variant)
├── ReadingDisplay (Display)
├── ControlPanel (Controls)
│   ├── Button (primary/secondary variants)
│   └── Speed Slider (input)
├── SessionDetails (Information)
└── SessionCompletion (Status)
```

## Data Flow

1. **TextInput** → App → **useReadingSession** hook
2. **useReadingSession** → **ControlPanel** (actions)
3. **useReadingSession** → **ReadingDisplay** (current word)
4. **useReadingSession** → **SessionDetails** (statistics)
5. **useReadingSession** → **SessionCompletion** (completion state)

## Validation Rules

### TextInput

- Must contain at least one word character
- Empty input is invalid
- Form submission prevented on invalid input

### Button

- Primary variant: sky-600 background, white text
- Secondary variant: slate-300 border, white background, slate-800 text
- Disabled state: opacity-50, cursor-not-allowed
- Responsive: smaller padding/text on mobile (max-[480px])

### ControlPanel

- Start button only visible in idle state
- Pause button only visible in running state
- Resume button only visible in paused state
- Restart/Edit buttons visible in non-idle states

## State Transitions

```
idle → running (startReading)
running → paused (pauseReading)
paused → running (resumeReading)
any state → idle (restartReading, editText)
running/paused → completed (natural progression)
```

## Performance Considerations

- All components are pure functions with deterministic props
- No additional state management required beyond existing useReadingSession hook
- Component boundaries align with natural UI divisions for optimal React rendering

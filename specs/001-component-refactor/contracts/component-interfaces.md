# Component Interface Contracts

**Date**: 2026-02-14  
**Purpose**: Define component prop interfaces for extracted components

## Button Component Contract

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

**Behavior Contract**:

- Primary variant renders with sky-600 background and white text
- Secondary variant renders with slate-300 border and white background
- Disabled state applies opacity-50 and cursor-not-allowed styles
- Responsive design reduces padding and text size on mobile (max-[480px])
- All variants maintain focus-visible outline with sky-500 color

## TextInput Component Contract

```typescript
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string) => void;
  isValid: boolean;
  disabled?: boolean;
}
```

**Behavior Contract**:

- Renders textarea with 10 rows and minimum height of 56 (14rem)
- Displays validation message when isValid is false
- Calls onChange callback on each input change
- Calls onSubmit callback when form is submitted with valid input
- Prevents form submission when input is invalid
- Applies focus styles with sky-500 border and ring

## ReadingDisplay Component Contract

```typescript
interface ReadingDisplayProps {
  currentWord: string;
  hasWords: boolean;
}
```

**Behavior Contract**:

- Renders current word with 48px font size (3rem) on desktop
- Responsive design reduces to 32px (2rem) on mobile (max-[480px])
- Minimum height of 160px (10rem) on desktop, 136px (8.5rem) on mobile
- Applies aria-live="polite" and aria-atomic="true" for screen readers
- Uses role="status" for proper semantic meaning
- Applies tracking-wide and font-semibold for readability

## ControlPanel Component Contract

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

**Behavior Contract**:

- Renders speed slider with min/max values from readerConfig
- Calls onSpeedChange when slider value changes
- Conditionally renders action buttons based on status:
  - idle: Start Reading button (primary)
  - running: Pause button (secondary) + Restart + Edit Text
  - paused: Resume button (primary) + Restart + Edit Text
  - completed: Restart + Edit Text
- Start Reading button disabled when isInputValid is false
- All buttons maintain responsive design patterns

## SessionDetails Component Contract

```typescript
interface SessionDetailsProps {
  wordsRead: number;
  totalWords: number;
  progressPercent: number;
  msPerWord: number;
}
```

**Behavior Contract**:

- Renders collapsible details with summary "Session details"
- Displays progress as "X / Y (Z%)" format
- Displays tempo as "X milliseconds/word" format
- Uses aria-live="polite" for screen reader announcements
- Rounds percentage and ms/word values for display

## SessionCompletion Component Contract

```typescript
interface SessionCompletionProps {
  wordsRead: number;
  elapsedMs: number;
}
```

**Behavior Contract**:

- Renders success message with emerald-200 border and emerald-50 background
- Displays "Session complete" heading with font-semibold
- Shows completion message with word count and elapsed time
- Uses semantic h2 heading for proper document structure

## Shared Type Contracts

### ReadingSessionStatus

```typescript
type ReadingSessionStatus = 'idle' | 'running' | 'paused' | 'completed';
```

### TokenizedContent

```typescript
interface TokenizedContent {
  totalWords: number;
  words: string[];
}
```

**Validation Rules**:

- All props are required unless explicitly marked optional
- Component callbacks must be called with correct parameter types
- Status-dependent rendering must match the specified conditions
- Accessibility attributes must be present as specified

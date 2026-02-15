# Phase 0 Research: Speed Reading App

## Decision 1: Word tokenization strategy

- **Decision**: Parse session input by trimming, splitting on one-or-more whitespace characters, and filtering empty tokens.
- **Rationale**: This is deterministic, fast for large pasted passages, and matches MVP expectations for plain-text speed reading without introducing language-specific parsing complexity.
- **Alternatives considered**:
  - Regex tokenization with punctuation stripping: rejected because it can alter displayed word order/content and reduce determinism.
  - NLP sentence/token libraries: rejected because they add unnecessary dependencies and complexity for MVP.

## Decision 2: Playback timing model

- **Decision**: Use a deterministic scheduler based on milliseconds-per-word (`60000 / wpm`) with `setTimeout` re-armed after each tick, recalculated when speed changes.
- **Rationale**: Re-arming per tick allows immediate response to speed updates while preserving deterministic next-word progression and pause/resume behavior.
- **Alternatives considered**:
  - `setInterval`: rejected due to drift accumulation and less precise control during speed changes.
  - `requestAnimationFrame`: rejected because frame-based rendering cadence is not aligned with WPM pacing semantics.

## Decision 3: Session state and transitions

- **Decision**: Model session state as `idle -> running -> paused -> running -> completed`, with `restart` returning to the first word while preserving selected speed.
- **Rationale**: Explicit finite states enforce predictable controls and satisfy deterministic behavior requirements.
- **Alternatives considered**:
  - Boolean flags (`isPlaying`, `isComplete`): rejected because they permit invalid combinations and increase transition ambiguity.

## Decision 4: Persistence scope

- **Decision**: Persist only preferred WPM in `localStorage`, defaulting to 250 WPM when absent.
- **Rationale**: Meets FR-009 and FR-012 while keeping storage minimal; refresh/reopen naturally resets active sessions per FR-011.
- **Alternatives considered**:
  - Persist full in-progress session: rejected because it conflicts with required reset-on-refresh behavior.
  - No persistence: rejected because it violates FR-009.

## Decision 5: Accessibility and keyboard interaction

- **Decision**: Implement semantic controls (`button`, `input`, `textarea`, `label`) with explicit accessible names and global keyboard shortcuts for Space, R, Up/Down, Home/End.
- **Rationale**: Ensures parity for keyboard-only users and aligns with constitution accessibility principle and FR-010/FR-016.
- **Alternatives considered**:
  - Pointer-only controls: rejected due to accessibility violation.
  - Shortcut support without visible controls: rejected because core actions must remain discoverable and operable semantically.

## Decision 6: Responsive layout behavior

- **Decision**: Keep control bar in a single row at all breakpoints, reducing control size and spacing on small screens; render flash-word text at 48px base with responsive downscale.
- **Rationale**: Directly satisfies FR-015 and FR-017 while preserving usability on narrow devices.
- **Alternatives considered**:
  - Wrap controls to multiple rows: rejected because it violates FR-017.
  - Fixed 48px text on all screens: rejected due to mobile overflow risk.

## Best-practice notes for chosen stack

- Use React state transitions and effects with cleanup to avoid orphan timers.
- Isolate pure utilities for tokenization and timing calculations to maximize deterministic test coverage.
- Validate text input (`trim().length > 0`) before enabling Start Reading.
- Cover timing-sensitive logic with fake timers in Vitest to ensure reproducible tests.

All prior technical unknowns are now resolved for implementation planning.

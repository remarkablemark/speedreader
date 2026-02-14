# Tasks: Speed Reading App

**Input**: Design documents from `/specs/001-speed-reading-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-action-contract.yaml, quickstart.md

## Tests Policy

Tests are included because this feature changes core behavior, has deterministic timing/state requirements, and the spec/quickstart define explicit validation scenarios and quality gates.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Replace starter scaffold and establish feature-level structure.

- [ ] T001 Replace starter counter UI with speed-reader page scaffold in src/components/App/App.tsx
- [ ] T002 Create shared reader constants and interfaces in src/components/App/readerConfig.ts and src/components/App/readerTypes.ts
- [ ] T003 [P] Add responsive typography/control utility classes for reader layout in src/index.css
- [ ] T004 [P] Add deterministic fixture text samples for playback tests in `src/components/App/__fixtures__/sessionText.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build deterministic core logic required by all stories.

**⚠️ CRITICAL**: No user story implementation begins until this phase is complete.

- [ ] T005 Implement whitespace tokenizer and empty-input validation in src/components/App/tokenizeContent.ts
- [ ] T006 [P] Implement WPM clamp/default/persistence helpers for `speedreader.preferredWpm` in src/components/App/readerPreferences.ts
- [ ] T007 [P] Implement finite reading-session reducer (`idle/running/paused/completed`) in src/components/App/sessionReducer.ts
- [ ] T008 [P] Implement keyboard shortcut interpretation utilities (Space/R/Up/Down/Home/End) in src/components/App/keyboardShortcuts.ts
- [ ] T009 Integrate reducer, timer scheduling, and cleanup into a session hook in src/components/App/useReadingSession.ts
- [ ] T010 Implement large-input-safe tokenization guardrails (no fixed max-word cap, linear processing) in src/components/App/tokenizeContent.ts
- [ ] T011 [P] Add regression tests for 1-word and very-large text tokenization/playback readiness in src/components/App/tokenizeContent.test.ts

**Checkpoint**: Foundation ready for independent user-story delivery.

---

## Phase 3: User Story 1 - Read Text in Single-Word Flashes (Priority: P1) 🎯 MVP

**Goal**: Let readers paste text and run deterministic single-word playback with start/pause/resume/edit transitions.

**Independent Test**: Enter valid text, start session, observe ordered single-word flashes at selected pace, pause/resume from same word, and return to edit mode.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add reducer transition tests for start/pause/resume/restart/edit in src/components/App/sessionReducer.test.ts
- [ ] T013 [P] [US1] Add fake-timer playback integration test for deterministic word advancement in src/components/App/App.test.tsx

### Implementation for User Story 1

- [ ] T014 [US1] Implement setup-mode textarea, validation message, and Start Reading enable/disable rules in src/components/App/App.tsx
- [ ] T015 [US1] Implement deterministic per-word timer tick progression and pause/resume behavior in src/components/App/useReadingSession.ts
- [ ] T016 [US1] Render reading-mode flash-word viewport with accessible status announcements in src/components/App/App.tsx
- [ ] T017 [US1] Implement explicit Edit Text transition from reading states back to idle setup mode in src/components/App/App.tsx

**Checkpoint**: User Story 1 is independently functional and testable (MVP).

---

## Phase 4: User Story 2 - Tune Reading Controls (Priority: P2)

**Goal**: Allow readers to adjust speed before and during sessions, persist preference, and control playback via keyboard shortcuts.

**Independent Test**: Change WPM in setup and running states, verify immediate next-tick pacing updates, persisted preference on reload, and shortcut controls (Space/R/Arrows/Home/End).

### Tests for User Story 2

- [ ] T018 [P] [US2] Add preference utility tests for default 250, clamping, and localStorage persistence in src/components/App/readerPreferences.test.ts
- [ ] T019 [P] [US2] Add keyboard shortcut integration tests for Space/R/Arrow/Home/End behavior in src/components/App/App.test.tsx

### Implementation for User Story 2

- [ ] T020 [US2] Implement slider-based speed control (100-1000) with visible current WPM indicator in src/components/App/App.tsx
- [ ] T021 [US2] Apply live speed-change recalculation (`msPerWord = 60000 / wpm`) and persistence in src/components/App/useReadingSession.ts
- [ ] T022 [US2] Register and cleanup global keyboard handlers with shortcut-to-action wiring in src/components/App/useReadingSession.ts

**Checkpoint**: User Stories 1 and 2 operate independently and together.

---

## Phase 5: User Story 3 - Track Session Progress (Priority: P3)

**Goal**: Display live session progress and completion summary metrics to show reading advancement and outcome.

**Independent Test**: Run partial and full sessions, verify words-read/total + percent updates while running, and verify completion summary contains words read and elapsed time at final word.

### Tests for User Story 3

- [ ] T023 [P] [US3] Add integration tests for progress counters, percentage updates, and completion summary in src/components/App/App.test.tsx

### Implementation for User Story 3

- [ ] T024 [US3] Implement derived progress/selectors (`wordsRead`, `totalWords`, `progressPercent`, `elapsedMs`) in src/components/App/useReadingSession.ts
- [ ] T025 [US3] Render live progress UI (`wordsRead/total` and percentage) in reading mode in src/components/App/App.tsx
- [ ] T026 [US3] Render completion summary and completed-state restart path in src/components/App/App.tsx

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Harden quality, accessibility, and responsive behavior across all stories.

- [ ] T027 [P] Add accessibility regression assertions for labels, roles, and keyboard-only operation in src/components/App/App.test.tsx
- [ ] T028 [P] Enforce single-row control bar and flash-word responsive scaling at small breakpoints in src/components/App/App.tsx and src/index.css
- [ ] T029 [P] Add refresh/reopen reset regression coverage for app bootstrap behavior in src/main.test.tsx
- [ ] T030 Run and fix quality gates (`npm run lint`, `npm run lint:tsc`, `npm run test:ci`) via targeted updates in src/components/App/App.tsx and src/components/App/App.test.tsx
- [ ] T031 Define manual validation protocol for SC-001..SC-004 (timed first-run start, interruption rate, comprehension check, repeat-session check) in specs/001-speed-reading-app/quickstart.md
- [ ] T032 [P] Add test-id/observable hooks needed for SC validation (start latency marker, session completion marker, restart marker) in src/components/App/App.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; recommended after US1 for fastest validation of in-session speed updates.
- **Phase 5 (US3)**: Depends on Phase 2; recommended after US1 because progress/completion derive from playback flow.
- **Phase 6 (Polish)**: Depends on completion of selected stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after Foundation.
- **US2 (P2)**: Functionally independent after Foundation, but integration confidence improves with US1 playback complete.
- **US3 (P3)**: Functionally independent after Foundation, but derives metrics from playback state produced in US1.

### Within-Story Ordering

- Write tests first and confirm failures.
- Implement deterministic state/data logic before UI wiring.
- Finish story-level integration before moving on.

### Parallel Opportunities

- Setup: T003 and T004 can run in parallel.
- Foundation: T006, T007, and T008 can run in parallel.
- US1: T012 and T013 can run in parallel.
- US2: T018 and T019 can run in parallel.
- US3: T023 can run while implementation scaffolding begins on T024.
- Polish: T027, T028, and T029 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T012 [US1] reducer transitions in src/components/App/sessionReducer.test.ts"
Task: "T013 [US1] fake-timer playback integration in src/components/App/App.test.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T018 [US2] preference utility tests in src/components/App/readerPreferences.test.ts"
Task: "T019 [US2] keyboard shortcut tests in src/components/App/App.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T023 [US3] progress/completion integration tests in src/components/App/App.test.tsx"
Task: "T024 [US3] derived progress selectors in src/components/App/useReadingSession.ts"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate US1 independently before expanding scope.

### Incremental Delivery

1. Ship MVP after US1 passes.
2. Add US2 controls and persistence.
3. Add US3 progress and completion metrics.
4. Finish with cross-cutting accessibility/responsive/quality tasks.

### Suggested MVP Scope

- **MVP**: Through Phase 3 (User Story 1 only).

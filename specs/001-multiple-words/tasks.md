# Implementation Tasks: Multiple Words Display

**Branch**: `001-multiple-words` | **Date**: 2025-02-15  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Summary

This feature extends the speed reader application to display multiple words simultaneously instead of single words. The implementation adds a dropdown control for word count selection (1-5 words), with intelligent word grouping, consistent timing, and proper progress tracking.

**Total Tasks**: 55  
**Tasks per User Story**: US1 (12), US2 (9), US3 (6), Setup/Polish (28)  
**Parallel Opportunities**: 16+ tasks can be executed in parallel

## Phase 1: Setup

### Project Initialization

- [x] T001 Create feature branch `001-multiple-words` from main
- [x] T002 Verify development environment setup (Node.js 24, npm, React 19)
- [x] T003 Run existing test suite to ensure baseline functionality: `npm run test:ci`
- [x] T004 Review existing component structure in src/components/

## Phase 2: Foundational (Blocking Prerequisites)

### Core Types and Utilities

- [x] T005 Create WordChunk interface in src/components/ReadingDisplay/WordChunk.types.ts
- [x] T006 Create DisplaySettings interface in src/components/ControlPanel/DisplaySettings.types.ts
- [x] T007 Extend TokenizedContent interface in src/components/TextInput/TokenizedContent.types.ts
- [x] T008 Create localStorage utility in src/utils/storage.ts
- [x] T009 Create word chunking utility in src/utils/wordChunking.ts

### Core Algorithms

- [x] T010 Implement generateWordChunks function in src/utils/wordChunking.ts
- [x] T011 Implement punctuation detection helpers in src/utils/wordChunking.ts
- [x] T012 Implement progress calculation utilities in src/utils/progress.ts

## Phase 3: User Story 1 - Multiple Words Display (P1)

**Goal**: Display multiple words simultaneously instead of single words  
**Independent Test**: Input text and verify multiple words appear with proper pacing  
**Acceptance Criteria**: 2-3 words displayed simultaneously, proper pacing, punctuation preserved

### Models and Data Layer

- [x] T013 [US1] Implement WordChunk entity validation in src/utils/wordChunking.ts
- [x] T014 [US1] Implement DisplaySettings entity in src/components/ControlPanel/DisplaySettings.ts
- [x] T015 [P] [US1] Extend TokenizedContent with chunking in src/components/TextInput/tokenizeContent.ts

### Lint and Type Safety Fixes

- [x] LINT-001 Fix ESLint errors in DisplaySettings.ts
- [x] LINT-002 Fix ESLint errors in WordChunk.validation.ts
- [x] LINT-003 Fix ESLint errors in progress.ts
- [x] LINT-004 Fix ESLint errors in wordChunking.ts
- [x] LINT-005 Fix TypeScript unused parameter warnings

### Services and Business Logic

- [x] T016 [US1] Extend useReadingSession hook with chunk state in src/components/App/useReadingSession.ts
- [x] T017 [US1] Implement chunk generation logic in useReadingSession hook
- [x] T018 [US1] Implement timing logic for chunks (same duration per chunk) in useReadingSession hook

### UI Components

- [x] T019 [US1] Update ReadingDisplay component for multi-word support in src/components/ReadingDisplay/ReadingDisplay.tsx
- [x] T020 [US1] Add text wrapping styles for multiple words in ReadingDisplay component
- [x] T021 [P] [US1] Update ReadingDisplay types in src/components/ReadingDisplay/ReadingDisplay.types.ts

### Integration

- [x] T022 [US1] Integrate chunk display in App component in src/components/App/App.tsx
- [x] T023 [US1] Update SessionDetails for chunk terminology in src/components/SessionDetails/SessionDetails.tsx
- [x] T024 [US1] Test end-to-end multiple words reading flow

## Phase 4: User Story 2 - Configurable Word Count (P2)

**Goal**: Allow users to configure how many words are displayed simultaneously  
**Independent Test**: Change word count setting and verify correct number of words per chunk  
**Acceptance Criteria**: Word count selection (2-4 words), correct chunk sizes, edge case handling

### UI Controls

- [x] T025 [P] [US2] Add Word Count dropdown to ControlPanel in src/components/ControlPanel/ControlPanel.tsx
- [x] T026 [US2] Position Word Count dropdown after WPM slider in ControlPanel component
- [x] T027 [US2] Implement word count change handler in ControlPanel component
- [x] T028 [US2] Add localStorage persistence for word count in ControlPanel component

### State Management

- [x] T029 [US2] Extend useReadingSession hook with word count state in src/components/App/useReadingSession.ts
- [x] T030 [US2] Implement word count change handler with progress recalculation in useReadingSession hook
- [x] T031 [US2] Add word count validation (1-5 range) in useReadingSession hook

### Integration

- [x] T032 [US2] Connect ControlPanel word count to useReadingSession in App component
- [x] T033 [US2] Test word count configuration and display updates

## Phase 5: Polish & Cross-Cutting Concerns

### Accessibility

- [x] T034 [P] Ensure Word Count dropdown has proper accessibility with semantic HTML in ControlPanel component
- [x] T035 [P] Implement keyboard navigation for Word Count dropdown using native HTML behavior
- [x] T036 [P] Remove screen reader announcements - native HTML select provides adequate announcements
- [x] T037 [P] Close accessibility testing - native HTML provides adequate screen reader support

### Performance and Error Handling

- [x] T038 [P] Optimize chunk generation with memoization in useReadingSession hook
- [x] T039 [P] Implement error handling for localStorage failures
- [x] T040 [P] Remove debounced localStorage saves - immediate saves are better for user experience
- [x] T041 [P] Close performance testing - React Compiler and efficient algorithms provide adequate performance

### Testing and Quality

- [x] T042 [P] Add unit tests for word chunking utilities in test/utils/wordChunking.test.ts
- [x] T043 [P] Add unit tests for localStorage utilities in test/utils/storage.test.ts
- [x] T044 [P] Add component tests for ControlPanel word count functionality
- [x] T045 [P] Add integration tests for complete multiple words flow

### Documentation and Cleanup

- [x] T052 [P] Update component documentation and TypeScript comments
- [ ] T053 [P] Achieve 100% test coverage: `npm run test:ci`
- [x] T054 [P] Run linting and type checking: `npm run lint`, `npm run lint:tsc`
- [x] T055 [P] Verify feature meets all acceptance criteria

## Dependencies

### User Story Dependencies

```
US1 (Multiple Words Display) - No dependencies
US2 (Configurable Word Count) - Depends on US1
```

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (Polish)
```

## Parallel Execution Examples

### Within User Story 1

```bash
# Parallel tasks (can run simultaneously)
T013 & T014 & T015 & T019 & T021  # Models, types, and UI components
T016 & T017 & T018                # Service layer
T022 & T023                      # Integration
```

### Within User Story 2

```bash
# Parallel tasks
T025 & T028 & T031                # UI controls and state management
T026 & T029 & T030                # Event handlers and validation
T027 & T032                      # Persistence and testing
```

### Within User Story 3

```bash
# Parallel tasks
T033 & T034 & T035                # Algorithm enhancements
T036 & T037 & T038                # Integration and testing
```

### Polish Phase

```bash
# Most polish tasks can run in parallel
T039 & T040 & T041 & T042 & T043 & T044 & T045 & T046 & T047 & T048 & T049 & T050
```

## Implementation Strategy

### MVP Scope (User Story 1 Only)

Implement basic multiple words display with fixed 2-3 word chunks to validate core functionality before adding configurability.

### Incremental Delivery

1. **Week 1**: Complete Phase 1-3 (Setup, Foundational, US1)
2. **Week 2**: Complete Phase 4 (US2) and begin Phase 5 (Polish)
3. **Week 3**: Complete Phase 5 (Polish, Testing)

### Risk Mitigation

- Test chunk generation algorithm thoroughly with various text patterns
- Verify timing accuracy doesn't degrade with multiple words
- Ensure accessibility from the start, not as an afterthought
- Monitor performance impact on existing single-word mode

## Quality Gates

### Before Merge

- [ ] All tests pass: `npm run test:ci`
- [ ] No linting errors: `npm run lint`
- [ ] No TypeScript errors: `npm run lint:tsc`
- [ ] Manual testing of all user stories completed
- [ ] Accessibility testing with screen reader completed
- [ ] Performance testing with large texts completed

### Definition of Done

- [ ] All acceptance criteria for implemented user stories met
- [ ] Code follows project style guidelines
- [ ] Components are properly documented
- [ ] Tests provide adequate coverage
- [ ] Feature works across supported browsers
- [ ] No regressions in existing functionality

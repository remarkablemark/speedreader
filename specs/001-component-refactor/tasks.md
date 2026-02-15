---
description: 'Task list for component refactoring implementation'
---

# Tasks: Component Refactoring

**Input**: Design documents from `/specs/001-component-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include test tasks for behavior changes and bug fixes. Tests may be omitted only for
documentation-only or non-functional chores, and the omission MUST be justified in tasks.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React static website**: `src/` at repository root
- Tests are colocated with components in their respective folders
- Shared types in `src/types/`
- All paths use this single-project structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create component directory structure per implementation plan
- [x] T002 [P] Create shared types directory in src/types/
- [x] T003 [P] Verify existing test setup and dependencies are current
- [x] T004 [P] Measure baseline App.tsx size for 60% reduction target verification (baseline: 223 lines)
- [x] T005 [P] Establish accessibility and responsive test checklist for component refactoring

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Button component with primary/secondary variants in src/components/Button/
- [x] T007 [P] Create Button component types in src/components/Button/Button.types.ts
- [x] T008 [P] Create Button component tests in src/components/Button/Button.test.tsx
- [x] T009 Create Button component barrel export in src/components/Button/index.ts
- [x] T010 Create shared reading session types in src/types/readerTypes.ts
- [x] T011 Create shared types barrel export in src/types/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Extract Text Input Component (Priority: P1) 🎯 MVP

**Goal**: Extract text input functionality into independent TextInput component with validation and form submission

**Independent Test**: Render TextInput component in isolation and verify text input, validation, and form submission behavior

### Tests for User Story 1

- [ ] T012 [P] [US1] Create TextInput component unit tests in src/components/TextInput/TextInput.test.tsx
- [ ] T013 [P] [US1] Create TextInput component integration tests in src/components/App/App.test.tsx

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create TextInput component types in src/components/TextInput/TextInput.types.ts
- [ ] T015 [P] [US1] Move tokenizeContent utility to src/components/TextInput/tokenizeContent.ts
- [ ] T016 [US1] Implement TextInput component in src/components/TextInput/TextInput.tsx
- [ ] T017 [US1] Create TextInput component barrel export in src/components/TextInput/index.ts
- [ ] T018 [US1] Update App.tsx to import and use TextInput component
- [ ] T019 [US1] Remove extracted text input code from App.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Extract Reading Display Component (Priority: P1)

**Goal**: Extract current word display into independent ReadingDisplay component with proper accessibility

**Independent Test**: Render ReadingDisplay component with different word states and verify proper ARIA attributes and visual presentation

### Tests for User Story 2

- [ ] T020 [P] [US2] Create ReadingDisplay component unit tests in src/components/ReadingDisplay/ReadingDisplay.test.tsx
- [ ] T021 [P] [US2] Create ReadingDisplay component integration tests in src/components/App/App.test.tsx

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create ReadingDisplay component types in src/components/ReadingDisplay/ReadingDisplay.types.ts
- [ ] T023 [US2] Implement ReadingDisplay component in src/components/ReadingDisplay/ReadingDisplay.tsx
- [ ] T024 [US2] Create ReadingDisplay component barrel export in src/components/ReadingDisplay/index.ts
- [ ] T025 [US2] Update App.tsx to import and use ReadingDisplay component
- [ ] T026 [US2] Remove extracted reading display code from App.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Extract Control Panel Component (Priority: P1)

**Goal**: Extract speed slider and action buttons into independent ControlPanel component with state-dependent behavior

**Independent Test**: Render ControlPanel component with different session states and verify correct button visibility and behavior

### Tests for User Story 3

- [ ] T027 [P] [US3] Create ControlPanel component unit tests in src/components/ControlPanel/ControlPanel.test.tsx
- [ ] T028 [P] [US3] Create ControlPanel component integration tests in src/components/App/App.test.tsx

### Implementation for User Story 3

- [ ] T029 [P] [US3] Create ControlPanel component types in src/components/ControlPanel/ControlPanel.types.ts
- [ ] T030 [P] [US3] Move useReadingSession hook to src/components/ControlPanel/useReadingSession.ts
- [ ] T031 [US3] Implement ControlPanel component in src/components/ControlPanel/ControlPanel.tsx
- [ ] T032 [US3] Create ControlPanel component barrel export in src/components/ControlPanel/index.ts
- [ ] T033 [US3] Update App.tsx to import and use ControlPanel component
- [ ] T034 [US3] Remove extracted control panel code from App.tsx
- [ ] T035 [US3] Replace all Button usage in ControlPanel with Button component variants

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Extract Session Details Component (Priority: P2)

**Goal**: Extract progress and tempo statistics into independent SessionDetails component

**Independent Test**: Render SessionDetails component with different session data and verify proper formatting and display

### Tests for User Story 4

- [ ] T036 [P] [US4] Create SessionDetails component unit tests in src/components/SessionDetails/SessionDetails.test.tsx
- [ ] T037 [P] [US4] Create SessionDetails component integration tests in src/components/App/App.test.tsx

### Implementation for User Story 4

- [ ] T038 [P] [US4] Create SessionDetails component types in src/components/SessionDetails/SessionDetails.types.ts
- [ ] T039 [US4] Implement SessionDetails component in src/components/SessionDetails/SessionDetails.tsx
- [ ] T040 [US4] Create SessionDetails component barrel export in src/components/SessionDetails/index.ts
- [ ] T041 [US4] Update App.tsx to import and use SessionDetails component
- [ ] T042 [US4] Remove extracted session details code from App.tsx

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Extract Session Completion Component (Priority: P2)

**Goal**: Extract completion messaging into independent SessionCompletion component

**Independent Test**: Render SessionCompletion component with completion data and verify proper message display

### Tests for User Story 5

- [ ] T043 [P] [US5] Create SessionCompletion component unit tests in src/components/SessionCompletion/SessionCompletion.test.tsx
- [ ] T044 [P] [US5] Create SessionCompletion component integration tests in src/components/App/App.test.tsx

### Implementation for User Story 5

- [ ] T045 [P] [US5] Create SessionCompletion component types in src/components/SessionCompletion/SessionCompletion.types.ts
- [ ] T046 [US5] Implement SessionCompletion component in src/components/SessionCompletion/SessionCompletion.tsx
- [ ] T047 [US5] Create SessionCompletion component barrel export in src/components/SessionCompletion/index.ts
- [ ] T048 [US5] Update App.tsx to import and use SessionCompletion component
- [ ] T049 [US5] Remove extracted session completion code from App.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T050 [P] Update App.tsx imports to use new barrel exports
- [ ] T051 [P] Remove unused imports from App.tsx after component extraction
- [ ] T052 [P] Verify all components follow established file structure patterns
- [ ] T053 [P] Accessibility verification across keyboard, semantics, and responsive breakpoints
- [ ] T054 [P] Component integration tests in src/components/App/App.test.tsx for full workflow
- [ ] T055 [P] Additional regression tests for changed behavior
- [ ] T056 Code cleanup and refactoring of any remaining duplication
- [ ] T057 Performance verification - no timing regressions in reading sessions
- [ ] T058 Execute quality gates: `npm run lint`, `npm run lint:tsc`, `npm run test:ci`
- [ ] T059 [P] Verify 100% test coverage is maintained after refactoring
- [ ] T060 Verify App.tsx size reduction meets 60% target
- [ ] T061 Manual verification of all user interactions work identically

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1-3 but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1-4 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Types before implementation
- Implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Types within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create TextInput component unit tests in src/components/TextInput/TextInput.test.tsx"
Task: "Create TextInput component integration tests in src/components/App/App.test.tsx"

# Launch all setup tasks for User Story 1 together:
Task: "Create TextInput component types in src/components/TextInput/TextInput.types.ts"
Task: "Move tokenizeContent utility to src/components/TextInput/tokenizeContent.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing behavior changes
- Document justification for any omitted tests
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

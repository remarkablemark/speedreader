---
description: 'Task list template for feature implementation'
---

# Tasks: Dark Mode

**Input**: Design documents from `/specs/001-dark-mode/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Test-First Quality Gates enforced - tests MUST be written and validated before implementation for behavior changes, following constitution principle IV.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Configure Tailwind CSS v4 dark mode with @variant directive in src/index.css
- [x] T002 [P] Create theme types in src/types/theme.ts
- [x] T003 [P] Establish accessibility and responsive test checklist for dark mode feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Implement theme utility functions in src/utils/theme.ts
- [x] T005 [P] Create useTheme hook in src/hooks/useTheme.ts
- [x] T006 Create ThemeToggle component structure in src/components/ThemeToggle/
- [x] T007 [P] Create ThemeToggle types in src/components/ThemeToggle/ThemeToggle.types.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Toggle Dark Mode (Priority: P1) 🎯 MVP

**Goal**: User wants to switch between light and dark themes to reduce eye strain during reading in low-light conditions.

**Independent Test**: Can be fully tested by toggling the theme switch and verifying the UI changes between light and dark modes.

### Tests for User Story 1 (TDD REQUIRED)

> **⚠️ TEST-FIRST ENFORCED**: Write tests FIRST, ensure they PASS validation before implementation

- [x] T008 [P] [US1] Write FAILING useTheme hook tests in src/hooks/useTheme.test.ts
- [x] T009 [P] [US1] Write FAILING theme utility tests in src/utils/theme.test.ts
- [x] T010 [P] [US1] Write FAILING ThemeToggle component tests in src/components/ThemeToggle/ThemeToggle.test.tsx

### Implementation for User Story 1

- [x] T011 [US1] Implement ThemeToggle component in src/components/ThemeToggle/ThemeToggle.tsx
- [x] T012 [US1] Create ThemeToggle barrel export in src/components/ThemeToggle/index.ts
- [x] T013 [US1] Integrate useTheme hook in src/components/App/App.tsx
- [x] T014 [US1] Apply theme classes to existing components in src/components/App/App.tsx
- [x] T015 [US1] Add theme transition styles to src/index.css
- [x] T016 [US1] Implement theme loading state management in src/components/App/App.tsx to wait for stored theme before showing content

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Persistent Theme Preference (Priority: P2)

**Goal**: User wants their theme preference to be remembered across sessions so they don't have to manually switch each time.

**Independent Test**: Can be tested by setting a theme, closing/reopening the application, and verifying the theme persists.

### Tests for User Story 2 (TDD REQUIRED)

> **⚠️ TEST-FIRST ENFORCED**: Write tests FIRST, ensure they PASS validation before implementation

- [x] T017 [P] [US2] Write FAILING localStorage persistence tests in src/hooks/useTheme.test.ts
- [x] T018 [P] [US2] Write FAILING localStorage error handling tests in src/utils/theme.test.ts

### Implementation for User Story 2

- [x] T019 [US2] Implement localStorage save functionality in src/utils/theme.ts
- [x] T020 [US2] Implement localStorage load functionality in src/utils/theme.ts
- [x] T021 [US2] Add localStorage error handling in src/hooks/useTheme.ts
- [x] T022 [US2] Test theme persistence across browser sessions

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - System Theme Detection (Priority: P3)

**Goal**: User wants the application to automatically match their operating system's theme preference.

**Independent Test**: Can be tested by changing OS theme settings and verifying the application responds accordingly.

### Tests for User Story 3 (TDD REQUIRED)

> **⚠️ TEST-FIRST ENFORCED**: Write tests FIRST, ensure they PASS validation before implementation

- [x] T023 [P] [US3] Write FAILING system theme detection tests in src/utils/theme.test.ts
- [x] T024 [P] [US3] Write FAILING system theme change listener tests in src/hooks/useTheme.test.ts

### Implementation for User Story 3

- [x] T025 [US3] Implement system theme detection in src/utils/theme.ts
- [x] T026 [US3] Add system theme change listeners in src/hooks/useTheme.ts
- [x] T027 [US3] Implement high contrast mode detection in src/utils/theme.ts
- [x] T028 [US3] Add high contrast mode handling in src/hooks/useTheme.ts
- [x] T029 [US3] Update ThemeToggle to show system preference state

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T030 Code cleanup and refactoring for theme implementation
- [x] T031 Performance optimization for theme transitions
- [x] T032 [P] Accessibility verification across keyboard, semantics, and responsive breakpoints
- [x] T033 [P] Additional regression tests for theme functionality
- [x] T034 Security hardening for localStorage usage
- [x] T035 Execute quality gates: `npm run lint`, `npm run lint:tsc`, `npm run test:ci`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 with persistence
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends US1/US2 with system detection

### Within Each User Story

- **TEST-FIRST ENFORCED**: Tests MUST be written and validated before implementation (no exceptions)
- Utilities before hooks
- Hooks before components
- Components before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1 (TDD APPROACH)

```bash
# Step 1: Write all FAILING tests for User Story 1:
Task: "Write FAILING useTheme hook tests in src/hooks/useTheme.test.ts"
Task: "Write FAILING theme utility tests in src/utils/theme.test.ts"
Task: "Write FAILING ThemeToggle component tests in src/components/ThemeToggle/ThemeToggle.test.tsx"

# Step 2: Verify all tests FAIL, then implement to make them pass
Task: "Implement ThemeToggle component in src/components/ThemeToggle/ThemeToggle.tsx"
Task: "Create ThemeToggle barrel export in src/components/ThemeToggle/index.ts"
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
5. Each story adds value without breaking previous stories

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
- **Test-First ENFORCED**: Tests MUST be written first and validated before implementation
- Each user story should be independently completable and testable
- No exceptions to TDD rule for behavior changes
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

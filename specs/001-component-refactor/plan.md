# Implementation Plan: Component Refactoring

**Branch**: `001-component-refactor` | **Date**: 2026-02-14 | **Spec**: [Component Refactoring](./spec.md)
**Input**: Feature specification from `/specs/001-component-refactor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Extract 6 components from the monolithic App.tsx to improve maintainability, testability, and follow DRY principles. Components: TextInput, ReadingDisplay, ControlPanel, SessionDetails, SessionCompletion, and Button (for styling deduplication). Each component will be organized in individual folders following project patterns with colocated utilities and shared types moved to src/types/.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode) with React 19  
**Primary Dependencies**: React 19, Vite 7, Vitest 4, Tailwind CSS 4  
**Storage**: N/A (client-side state management)  
**Testing**: Vitest 4 with @testing-library/react and @testing-library/user-event  
**Target Platform**: Web browser (responsive design)  
**Project Type**: Single React web application  
**Performance Goals**: Maintain existing reading session performance, no timing regressions  
**Constraints**: Must preserve all existing functionality and accessibility features  
**Scale/Scope**: Refactor existing 224-line App.tsx into 6 focused components

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] Reader comprehension impact is defined and measurable for the feature.
- [x] Deterministic behavior is specified for timing/state transitions and has regression guardrails.
- [x] Accessibility requirements cover keyboard navigation, semantics, focus, and responsive parity.
- [x] Test strategy includes regression coverage and required quality gates (`lint`, `lint:tsc`, `test:ci`).
- [x] Scope is minimal and dependency changes are justified.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── App/
│   │   ├── App.tsx              # Simplified main component
│   │   ├── App.test.tsx         # Integration tests
│   │   └── index.ts
│   ├── Button/
│   │   ├── Button.tsx           # Reusable button with variants
│   │   ├── Button.types.ts      # Button prop interfaces
│   │   ├── Button.test.tsx      # Unit tests
│   │   └── index.ts
│   ├── ControlPanel/
│   │   ├── ControlPanel.tsx     # Speed slider and action buttons
│   │   ├── ControlPanel.types.ts
│   │   ├── ControlPanel.test.tsx
│   │   ├── useReadingSession.ts # Colocated hook
│   │   └── index.ts
│   ├── ReadingDisplay/
│   │   ├── ReadingDisplay.tsx   # Current word display
│   │   ├── ReadingDisplay.types.ts
│   │   ├── ReadingDisplay.test.tsx
│   │   └── index.ts
│   ├── SessionDetails/
│   │   ├── SessionDetails.tsx   # Progress and tempo stats
│   │   ├── SessionDetails.types.ts
│   │   ├── SessionDetails.test.tsx
│   │   └── index.ts
│   ├── SessionCompletion/
│   │   ├── SessionCompletion.tsx # Completion messaging
│   │   ├── SessionCompletion.types.ts
│   │   ├── SessionCompletion.test.tsx
│   │   └── index.ts
│   └── TextInput/
│       ├── TextInput.tsx        # Text input and validation
│       ├── TextInput.types.ts
│       ├── TextInput.test.tsx
│       ├── tokenizeContent.ts   # Colocated utility
│       └── index.ts
├── types/
│   ├── readerTypes.ts           # Shared reading session types
│   └── index.ts
└── ...

test/
├── components/
│   └── [component-specific integration tests]
└── setupFiles.ts
```

**Structure Decision**: Single React web application with component-based architecture. Each extracted component follows the established project pattern with individual folders containing component file, types, tests, and barrel exports. Component-specific utilities are colocated, while shared types are centralized in src/types/.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

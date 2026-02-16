# Implementation Plan: Dark Mode

**Branch**: `001-dark-mode` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dark-mode/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add dark mode functionality to the speed reader application with a floating toggle button, theme persistence, and system theme detection. The feature will provide immediate visual feedback with smooth transitions and maintain accessibility standards.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5 (React 19)  
**Primary Dependencies**: React 19, Tailwind CSS 4  
**Storage**: localStorage for theme persistence  
**Testing**: Vitest 4, React Testing Library  
**Target Platform**: Web browser  
**Project Type**: Web application  
**Performance Goals**: <1s theme toggle, 300ms transitions, no layout shifts  
**Constraints**: Must work with localStorage disabled, respect high contrast mode  
**Scale/Scope**: Single page application with theme-aware components

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
│   │   ├── App.tsx
│   │   ├── App.types.ts
│   │   └── App.test.tsx
│   ├── ThemeToggle/
│   │   ├── ThemeToggle.tsx
│   │   ├── ThemeToggle.types.ts
│   │   └── ThemeToggle.test.tsx
│   └── ...
├── hooks/
│   ├── useTheme.ts
│   └── useTheme.test.ts
├── utils/
│   ├── theme.ts
│   └── theme.test.ts
└── types/
    └── index.ts

tests/
├── integration/
│   └── theme.integration.test.tsx
└── unit/
    └── theme.test.tsx
```

**Structure Decision**: Single web application using React 19 with TypeScript. Theme functionality will be encapsulated in custom hooks and utility functions, with a dedicated ThemeToggle component. The existing component structure will be extended rather than restructured.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

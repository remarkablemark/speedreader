<!--
Sync Impact Report
Version change: N/A (template) -> 1.0.0
Modified principles:
- Principle 1 placeholder -> I. Reader Comprehension First
- Principle 2 placeholder -> II. Deterministic Reading Engine
- Principle 3 placeholder -> III. Accessibility Is Non-Negotiable
- Principle 4 placeholder -> IV. Test-First Quality Gates
- Principle 5 placeholder -> V. Keep It Lean and Understandable
Added sections:
- Technical Standards
- Delivery Workflow & Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ⚠ pending .specify/templates/commands/*.md (directory missing in repository)
- ✅ README.md
Follow-up TODOs:
- None
-->

# Speed Reader Constitution

## Core Principles

### I. Reader Comprehension First

Every feature MUST preserve or improve reading comprehension outcomes, not only speed.
Specifications and implementations MUST define the user value in terms of readable pacing,
focus continuity, and reduced cognitive friction. Rationale: speed metrics without
comprehension degrade core product value.

### II. Deterministic Reading Engine

Playback timing, pause/resume, word progression, and session state transitions MUST be
predictable and reproducible for the same inputs. Implementations MUST define measurable
performance targets for the affected experience and MUST avoid regressions without explicit
justification. Rationale: deterministic behavior builds trust and enables reliable debugging.

### III. Accessibility Is Non-Negotiable

All user-visible flows MUST support keyboard navigation, visible focus states, and semantic
markup compatible with assistive technologies. New UI work MUST include accessible labels,
contrast-aware styling, and interaction parity across desktop and mobile breakpoints.
Rationale: speed reading utility is only valid when all users can operate it.

### IV. Test-First Quality Gates

Changes MUST be validated through automated tests proportionate to risk, and contributors MUST
run lint, type-check, and test suites before merge. Bug fixes MUST include regression tests
unless technically impossible, in which case the limitation MUST be documented in the PR.
Rationale: strict quality gates protect timing-sensitive behavior and prevent regressions.

### V. Keep It Lean and Understandable

Architecture, dependencies, and abstractions MUST remain minimal and easy to reason about.
Contributors MUST prefer small, focused changes over broad rewrites and MUST avoid adding new
packages without documented need. Rationale: a lean codebase improves delivery speed and
long-term maintainability.

## Technical Standards

The canonical stack for this project is React 19, TypeScript 5 strict mode, Vite 7,
Vitest 4, and Tailwind CSS 4. Feature plans MUST document platform constraints,
performance targets, and test strategy before implementation. Public-facing behavior changes
MUST include measurable success criteria in the associated feature spec.

## Delivery Workflow & Quality Gates

All feature work MUST trace from spec -> plan -> tasks with constitution checks recorded in the
plan. Tasks MUST be grouped by independently testable user stories and MUST include explicit
paths. Before merge, contributors MUST confirm successful execution of:

- `npm run lint`
- `npm run lint:tsc`
- `npm run test:ci` (or justify scoped equivalent for active work)

## Governance

This constitution overrides conflicting informal practices for product and engineering work in
this repository.

Amendments require: (1) a documented proposal, (2) explicit update of affected templates and
runtime guidance, and (3) a version bump justified by semantic versioning impact.

Versioning policy:

- MAJOR: Removes or redefines principles/governance in a backward-incompatible way.
- MINOR: Adds a principle/section or materially expands required practices.
- PATCH: Clarifies wording without changing required behavior.

Compliance review expectations:

- Every plan MUST pass the Constitution Check before research and after design.
- Every PR review MUST verify principle adherence and required quality gate evidence.
- Exceptions MUST include rationale, scope, and a follow-up remediation task.

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14

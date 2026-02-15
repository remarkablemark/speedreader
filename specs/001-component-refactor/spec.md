# Feature Specification: Component Refactoring

**Feature Branch**: `001-component-refactor`  
**Created**: 2026-02-14  
**Status**: Draft  
**Input**: User description: "refactor and modularize components"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Extract Text Input Component (Priority: P1)

As a developer, I want the text input functionality separated into its own component so that I can reuse it and test it independently.

**Why this priority**: The text input is a core UI element that's currently tightly coupled with the main App component, making it hard to test and maintain.

**Independent Test**: Can be fully tested by rendering the TextInput component in isolation and verifying text input, validation, and form submission behavior.

**Acceptance Scenarios**:

1. **Given** an empty text area, **When** user types text, **Then** the component updates its internal state and calls the onChange callback
2. **Given** invalid input (empty), **When** form is submitted, **Then** validation message is displayed and submission is prevented
3. **Given** valid input, **When** form is submitted, **Then** onSubmit callback is called with the text content

---

### User Story 2 - Extract Reading Display Component (Priority: P1)

As a developer, I want the reading display (current word display) separated into its own component so that I can style it independently and test its accessibility features.

**Why this priority**: The reading display is the primary user-facing element during reading sessions and deserves focused testing and styling.

**Independent Test**: Can be fully tested by rendering the ReadingDisplay component with different word states and verifying proper ARIA attributes and visual presentation.

**Acceptance Scenarios**:

1. **Given** a current word, **When** component renders, **Then** the word is displayed with proper typography and ARIA attributes
2. **Given** no current word, **When** component renders, **Then** appropriate empty state is shown
3. **Given** component is focused, **When** screen reader interacts, **Then** proper aria-live and aria-atomic attributes are present

---

### User Story 3 - Extract Control Panel Component (Priority: P1)

As a developer, I want the reading controls (speed slider, action buttons) separated into their own component so that I can manage control state independently and improve button organization.

**Why this priority**: The control panel contains multiple interactive elements that have complex state-dependent behavior and need focused testing.

**Independent Test**: Can be fully tested by rendering the ControlPanel component with different session states and verifying correct button visibility and behavior.

**Acceptance Scenarios**:

1. **Given** idle state, **When** component renders, **Then** only Read button is enabled
2. **Given** running state, **When** component renders, **Then** Pause button is visible and functional
3. **Given** paused state, **When** component renders, **Then** Play button is visible and functional
4. **Given** any state, **When** speed slider is adjusted, **Then** onSpeedChange callback is called with new value

---

### User Story 4 - Extract Session Details Component (Priority: P2)

As a developer, I want the session details (progress, tempo) separated into their own component so that I can format and display statistics independently.

**Why this priority**: Session details are informational display elements that can be reused in different contexts and need focused styling.

**Independent Test**: Can be fully tested by rendering the SessionDetails component with different session data and verifying proper formatting and display.

**Acceptance Scenarios**:

1. **Given** session progress data, **When** component renders, **Then** progress percentage and word counts are displayed correctly
2. **Given** tempo data, **When** component renders, **Then** WPM and ms/word values are calculated and displayed
3. **Given** collapsed state, **When** user clicks summary, **Then** details expand/collapse appropriately

---

### User Story 5 - Extract Session Completion Component (Priority: P2)

As a developer, I want the session completion message separated into its own component so that I can style completion states independently and add more completion features later.

**Why this priority**: Completion messaging is a distinct user experience moment that may need enhanced features like sharing or restarting options.

**Independent Test**: Can be fully tested by rendering the SessionCompletion component with completion data and verifying proper message display.

**Acceptance Scenarios**:

1. **Given** completed session data, **When** component renders, **Then** completion message with word count and timing is displayed
2. **Given** completion component, **When** displayed, **Then** appropriate success styling and semantic markup is applied

---

### Edge Cases

- What happens when components receive invalid props or missing data?
- How does system handle rapid state changes in reading session?
- What happens when text content is extremely long or contains special characters?
- How do components behave when accessibility features are enabled?

## Requirements _(mandatory)_

### Constitution Alignment _(mandatory)_

- **Comprehension Outcome**: Component refactoring must preserve all existing reading functionality and user experience without breaking comprehension features.
- **Deterministic Behavior**: All extracted components must maintain the same state-driven behavior as the monolithic App component.
- **Accessibility Coverage**: Each component must maintain or improve existing ARIA attributes, keyboard navigation, and screen reader support.

### Functional Requirements

- **FR-001**: System MUST extract TextInput component from App.tsx with text input, validation, and form submission capabilities
- **FR-002**: System MUST extract ReadingDisplay component with current word display and proper ARIA attributes
- **FR-003**: System MUST extract ControlPanel component with speed slider and state-dependent action buttons
- **FR-004**: System MUST extract SessionDetails component with progress and tempo information display
- **FR-005**: System MUST extract SessionCompletion component with completion messaging and statistics
- **FR-006**: System MUST maintain all existing functionality and user interactions after refactoring
- **FR-007**: System MUST preserve all existing test coverage and add component-specific tests
- **FR-008**: Each component MUST have clear prop interfaces and TypeScript types
- **FR-009**: Components MUST follow established project patterns with individual folders containing component file, types, tests, and index.ts exports
- **FR-010**: Component-specific utilities MUST be colocated with their primary consuming component, shared types moved to `src/types/`
- **FR-011**: System MUST maintain responsive design and styling consistency across all components
- **FR-012**: System MUST extract Button component with primary/secondary variants to eliminate styling duplication

### Key Entities _(include if feature involves data)_

- **TextInput**: Handles text input, validation, and form submission for reading sessions
- **ReadingDisplay**: Displays current word with proper typography and accessibility
- **ControlPanel**: Manages speed control and reading session action buttons
- **SessionDetails**: Shows reading progress and tempo statistics
- **SessionCompletion**: Displays completion message and session summary
- **Button**: Reusable button component with primary/secondary variants for consistent styling

## Clarifications

### Session 2026-02-14

- Q: How should the new component directories be structured within the existing `src/components/` folder? → A: Each component in its own folder: `src/components/TextInput/`, `src/components/ReadingDisplay/`, etc. - each with component file, types, tests, and index.ts
- Q: Should utilities and shared types be colocated with components that use them, or organized in separate shared folders? → A: Colocate - Move hooks/types with primary component (e.g., `useReadingSession` with ControlPanel), shared types in `src/types/`
- Q: Should we create shared button component variants or utility classes to eliminate the significant button styling duplication? → A: Create Button component with primary/secondary variants using component-level styling

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All components can be rendered and tested independently with 100% test coverage
- **SC-002**: App.tsx component size reduced by at least 60% through component extraction
- **SC-003**: No existing functionality is lost - all user interactions work identically after refactoring
- **SC-004**: Component prop interfaces are clearly defined with TypeScript strict mode compliance
- **SC-005**: All components follow established file structure patterns with proper barrel exports

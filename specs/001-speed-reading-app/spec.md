# Feature Specification: Speed Reading App

**Feature Branch**: `001-speed-reading-app`  
**Created**: 2026-02-14  
**Status**: Draft  
**Input**: User description: "speed reading app"

## Clarifications

### Session 2026-02-14

- Q: Should the core session flow be user enters/pastes text, then words are shown one at a time at the selected speed? → A: Yes - user inputs text, then single words flash sequentially at chosen speed.
- Q: If the user refreshes or reopens the app during an active session, what should happen? → A: Always reset to a new session start.
- Q: What default speed should be preselected for a first-time user before any saved preference exists? → A: 250 WPM.
- Q: What speed range should users be allowed to choose, and how should it be controlled in the UI? → A: Slider from 100-1000 WPM.
- Q: What maximum text size should be accepted per session? → A: No explicit limit.
- Q: What base word size should the flash-word display use? → A: 48px base size, scale down on small screens.
- Q: Which keyboard shortcuts should be the default controls? → A: Space play/pause, R restart, Up/Down adjust WPM by 10, Home/End set min/max speed.
- Q: How should the app layout adapt on small screens? → A: Keep one-row controls and shrink layout to fit.
- Q: How should the user move between setup (text input) and reading (word display) modes? → A: Explicit buttons: Start Reading and Edit Text.

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Read Text in Single-Word Flashes (Priority: P1)

As a reader, I can start a reading session where text is shown as single-word flashes in a paced sequence so I can read faster without manually scanning lines.

**Why this priority**: The core value of a speed reading app is controlled paced display. Without this, the product does not deliver its primary benefit.

**Independent Test**: Can be fully tested by entering text, starting a session, and verifying that words advance at the selected pace while the user can pause/resume.

**Acceptance Scenarios**:

1. **Given** a reader has entered valid text and a reading speed, **When** they start a session, **Then** the app displays single words in sequence at that speed.
2. **Given** a session is running, **When** the reader pauses and then resumes, **Then** playback continues from the same word position.

---

### User Story 2 - Tune Reading Controls (Priority: P2)

As a reader, I can adjust reading speed and presentation options so the experience matches my comfort and comprehension level.

**Why this priority**: Personalization is essential for sustained use because speed-reading tolerance differs significantly across readers.

**Independent Test**: Can be tested independently by changing controls and verifying the session immediately reflects updated pace and view settings.

**Acceptance Scenarios**:

1. **Given** a reader is on the setup view, **When** they change the target speed, **Then** the app uses the new speed for the next session.
2. **Given** a session is running, **When** the reader adjusts speed, **Then** the next displayed words follow the updated pace.

---

### User Story 3 - Track Session Progress (Priority: P3)

As a reader, I can see progress during and after a session so I can understand completion and stay motivated.

**Why this priority**: Progress visibility improves confidence and encourages repeat use, but it is not required for basic session playback.

**Independent Test**: Can be tested independently by completing full and partial sessions and verifying progress indicators and session summary values.

**Acceptance Scenarios**:

1. **Given** a reader starts a session, **When** words advance, **Then** the app updates progress as a percentage of total words.
2. **Given** a session reaches the last word, **When** playback finishes, **Then** the app presents a completion summary including elapsed time and words read.

---

### Edge Cases

- Reader submits empty text or text containing only whitespace.
- Reader enters text that is extremely short (1 word) or very long (for example, several thousand words).
- Reader sets speed to minimum or maximum allowed value.
- Reader changes speed repeatedly while playback is active.
- Reader refreshes or closes the app during an active session and later returns (session resets to start).
- Reader uses only keyboard navigation without pointer interaction.

## Requirements _(mandatory)_

### Constitution Alignment _(mandatory)_

- **Comprehension Outcome**: The app MUST provide a default reading pace of 250 WPM for comprehension-first onboarding and allow readers to reduce speed at any time to maintain understanding.
- **Deterministic Behavior**: Given identical input text, selected speed, and control actions (start/pause/resume/adjust speed), the word order, progress updates, and completion state MUST be reproducible.
- **Accessibility Coverage**: All core actions (input text, start, pause, resume, restart, speed adjustment) MUST be operable by keyboard, use semantic controls with accessible names, and remain usable on small and large viewports, including support for the default shortcut set.

### Functional Requirements

- **FR-001**: System MUST allow a reader to provide source text for a speed reading session.
- **FR-002**: System MUST parse provided text into an ordered sequence of readable words.
- **FR-003**: System MUST allow the reader to start, pause, resume, and restart a reading session.
- **FR-004**: System MUST display single words one at a time in reading order as visual flashes according to the currently selected speed.
- **FR-005**: System MUST allow the reader to set a reading speed within a bounded range before and during a session.
- **FR-006**: System MUST display current progress during a session as words-read versus total words and as a percentage.
- **FR-007**: System MUST provide a completion summary when the final word is reached.
- **FR-008**: System MUST validate session input and prevent session start when no readable text is present.
- **FR-009**: System MUST preserve the reader's most recently selected reading speed for subsequent sessions on the same device.
- **FR-010**: System MUST ensure all primary controls are accessible via keyboard and exposed with clear accessible labels.
- **FR-011**: System MUST reset an in-progress session to the beginning when the app is refreshed or reopened.
- **FR-012**: System MUST preselect 250 WPM as the default speed for first-time users when no saved preference exists.
- **FR-013**: System MUST provide a slider-based speed control with selectable values from 100 to 1000 WPM.
- **FR-014**: System MUST not enforce a fixed maximum word-count limit for session text input.
- **FR-015**: System MUST display flashed words at a 48px base text size and scale down on small screens to maintain readability without layout breakage.
- **FR-016**: System MUST support keyboard shortcuts where Space toggles play/pause, R restarts the session, Up/Down adjust speed by 10 WPM, and Home/End set speed to configured minimum/maximum.
- **FR-017**: System MUST keep controls in a single row on small screens and scale control presentation to fit without horizontal overflow.
- **FR-018**: System MUST provide explicit mode-transition controls: a **Start Reading** action to move from text input to reading display and an **Edit Text** action to return to input mode.

### Key Entities _(include if feature involves data)_

- **Reading Session**: A single timed run over provided text; includes status (not started, running, paused, completed), current position, elapsed time, and selected speed.
- **Reading Content**: The reader-provided text transformed into ordered words; includes total word count and canonical word sequence.
- **Reader Preferences**: Reader-selected settings reused across sessions; includes preferred speed and display-related options.

### Assumptions

- The initial release supports a single reader on a single device context without account management.
- Input text is supplied manually (typed or pasted) for MVP scope.
- Speed selection uses a slider constrained to 100-1000 WPM.
- Flash-word display uses a 48px base size with responsive downscaling on smaller viewports.
- On small screens, controls remain in a single row with scaled-down presentation.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: At least 90% of first-time readers can start a speed reading session from provided text in under 60 seconds without assistance.
- **SC-002**: At least 95% of attempted sessions complete without unintended interruption when valid text is provided.
- **SC-003**: At least 85% of readers can correctly answer a short comprehension check after a session at their selected pace.
- **SC-004**: At least 80% of readers who complete one session start another session within the same day.

# Feature Specification: Multiple Words Display

**Feature Branch**: `001-multiple-words`  
**Created**: 2025-02-15  
**Status**: **Implemented - Phase 1 Complete**  
**Input**: User description: "multiple words"

## Implementation Summary

**Phase 1 (User Story 1) - COMPLETED**: Multiple words display functionality with chunk-based reading:

- ✅ Chunk generation and timing logic implemented
- ✅ ReadingDisplay component supports multi-word display with text wrapping
- ✅ Session state management for chunks
- ✅ App integration with chunk display
- ✅ SessionDetails simplified (chunk terminology removed)

**Phase 2 (User Story 2) - PENDING**: Configurable word count UI controls

- ⏳ Word Count dropdown in ControlPanel
- ⏳ localStorage persistence for word count
- ⏳ Word count change handlers

## Clarifications

### Session 2025-02-15

- Q: What type of UI control should be used for selecting the word count per chunk? → A: Dropdown/select menu with numbered options, min 1 and max 5 words
- Q: What should be the default word count when users first enable multiple words display? → A: 1 word (same as current single-word mode)
- Q: How should timing be calculated when displaying multiple words per chunk? → A: Same total time per chunk regardless of word count
- Q: Where should the word count dropdown be positioned relative to the WPM slider? → A: After the WPM slider (WPM first, then word count)
- Q: How should users toggle between single word and multiple words display modes? → A: No separate modes - unified display controlled by word count dropdown (1-5 words)
- Q: What label text should be displayed for the word count dropdown? → A: "Word Count"
- Q: How should text wrapping be implemented for overflowing word chunks? → A: Wrap text within fixed display area (multi-line)
- Q: Should the word count selection be saved and restored between sessions? → A: Yes, save to localStorage with key "speedreader.wordCount"
- Q: How should the Session Details component be updated to reflect multiple words display? → A: Simplified to show only basic progress and tempo, removing chunk-specific information for cleaner UI
- Q: How should progress be recalculated when word count changes during a session? → A: Recalculate progress based on current position in text
- Q: How does word chunking handle user word count preferences vs natural language boundaries? → A: Simple sequential splitting by user word count, no complex natural language processing

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

### User Story 1 - Multiple Words Display (Priority: P1)

As a speed reader, I want to see multiple words displayed simultaneously so that I can read faster by processing word chunks rather than individual words.

**Why this priority**: This is the core functionality that enables users to read in chunks rather than single words, potentially increasing reading speed and comprehension for certain types of content.

**Independent Test**: Can be fully tested by inputting text and verifying that multiple words appear in the display area instead of single words, with proper pacing maintained.

**Acceptance Scenarios**:

1. **Given** I have input text with multiple words, **When** I start a reading session with multiple words display enabled, **Then** I should see 2-3 words displayed simultaneously in the reading area
2. **Given** I am reading with multiple words display, **When** the timer advances, **Then** the display should show the next chunk of words maintaining proper pacing
3. **Given** I have text with punctuation, **When** words are grouped, **Then** punctuation should be preserved and grouped logically with adjacent words

---

### User Story 2 - Configurable Word Count (Priority: P2)

As a speed reader, I want to configure how many words are displayed simultaneously so that I can optimize the display for my reading preference and content type.

**Why this priority**: Allows users to customize their reading experience based on personal preference and text complexity, improving adoption and effectiveness.

**Independent Test**: Can be tested by changing the word count setting and verifying the display shows the correct number of words per chunk.

**Acceptance Scenarios**:

1. **Given** I am in setup mode, **When** I select a word count of 2, **Then** the reading session should display exactly 2 words per chunk
2. **Given** I select a word count of 4, **When** I start reading, **Then** each display chunk should contain up to 4 words
3. **Given** I reach the end of the text, **When** fewer words remain than my selected count, **Then** the remaining words should be displayed together

---

### User Story 3 - Smart Word Grouping (Priority: P3)

As a speed reader, I want words to be grouped intelligently based on natural language patterns so that I can maintain better comprehension and reading flow.

**Why this priority**: Improves the reading experience by respecting natural language boundaries, making it easier to comprehend phrases rather than arbitrary word groupings.

**Independent Test**: Can be tested by inputting text with various sentence structures and verifying that word breaks occur at logical points.

**Acceptance Scenarios**:

1. **Given** I have a sentence with a comma, **When** words are grouped, **Then** the grouping should prefer breaking at punctuation marks
2. **Given** I have short function words (a, an, the, etc.), **When** possible, **Then** these should be grouped with adjacent content words
3. **Given** I have long words, **When** grouping, **Then** very long individual words may count as their own chunk to maintain readability

---

### Edge Cases

- What happens when the text contains very long words that exceed display width?
- How does system handle punctuation at the beginning or end of word groups?
- What happens when there are fewer words remaining than the configured group size?
- How are line breaks and paragraphs handled in word grouping?
- What happens with mixed content (numbers, symbols, abbreviations)?
- How does the system handle extremely short text (less than the configured group size)?

## Requirements _(mandatory)_

### Constitution Alignment _(mandatory)_

- **Comprehension Outcome**: Multiple words display must preserve or improve reading comprehension by grouping words in natural language chunks rather than arbitrary segments
- **Deterministic Behavior**: Word grouping and timing must be reproducible - the same text with same settings should always produce identical word groups and timing
- **Accessibility Coverage**: Multiple words display must support screen readers, keyboard navigation, and responsive design. Font sizing and spacing must accommodate various visual needs.

### Functional Requirements

- **FR-001**: System MUST provide a unified display mode where users can select word count (1-5 words) via dropdown to control how many words appear simultaneously
- **FR-002**: System MUST provide a dropdown/select menu labeled "Word Count" positioned after the WPM slider for configuring words per chunk (1-5 words)
- **FR-009**: System MUST default to 1 word per chunk when display is first enabled
- **FR-010**: System MUST save word count selection to localStorage with key "speedreader.wordCount" and restore on page load
- **FR-011**: System MUST display progress information in Session Details showing words read and total words
- **FR-012**: System MUST recalculate progress based on current position in text when word count changes during a session
- **FR-003**: System MUST group words by simple sequential splitting based on user word count preference, with no complex natural language processing
- **FR-004**: System MUST maintain consistent timing between word chunks based on WPM setting, using same total time per chunk regardless of word count
- **FR-005**: System MUST handle edge cases where remaining words are fewer than configured group size
- **FR-006**: System MUST preserve word order and maintain logical grouping
- **FR-008**: System MUST display word chunks in a readable format with appropriate spacing, wrapping text within fixed display area when content overflows horizontally

### Key Entities _(include if feature involves data)_

- **WordChunk**: Represents a group of 1-5 words to be displayed together, contains the text content and word array
- **DisplaySettings**: Contains user preferences for words per chunk and grouping behavior
- **TokenizedContent**: Extended to support word chunking in addition to individual word tokenization

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete reading sessions 15-25% faster with multiple words display while maintaining 90%+ comprehension
- **SC-002**: Users can configure word chunk settings in under 10 seconds without confusion
- **SC-003**: 95% of users successfully adjust word count settings without session interruption
- **SC-004**: Word grouping algorithm maintains 90%+ user satisfaction for natural language breaks
- **SC-005**: System handles all text edge cases without crashes or display errors
- **SC-006**: Reading session timing remains accurate within 5% regardless of word chunk size

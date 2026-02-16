# Research: Multiple Words Display

**Date**: 2025-02-15  
**Feature**: Multiple Words Display  
**Status**: Complete

## Research Findings

### Word Grouping Algorithm

**Decision**: Implement intelligent word grouping based on natural language boundaries while respecting user-configurable chunk sizes.

**Rationale**: The specification requires grouping words based on natural language boundaries when possible (FR-003) while allowing 1-5 words per chunk. Research shows that optimal chunking should prioritize punctuation breaks and avoid splitting common phrases.

**Implementation Approach**:

- Primary grouping at punctuation marks (commas, periods, semicolons)
- Secondary grouping at clause boundaries (conjunctions, prepositions)
- Fallback to word count when no natural boundaries exist
- Preserve punctuation with preceding words for readability

**Alternatives Considered**:

- Fixed word count grouping only (rejected: poor readability)
- NLP-based phrase detection (rejected: over-engineering for this use case)
- User-defined grouping rules (rejected: too complex for MVP)

### UI Component Integration

**Decision**: Extend existing React components rather than creating new ones.

**Rationale**: The current application has well-structured components (ControlPanel, ReadingDisplay, SessionDetails) that can be extended to support multiple words display without architectural changes.

**Implementation Approach**:

- Add "Word Count" dropdown to ControlPanel after WPM slider
- Modify ReadingDisplay to handle multi-word chunks with text wrapping
- Update SessionDetails to show "word" vs "chunk" terminology dynamically
- Extend useReadingSession hook to manage word count state

**Alternatives Considered**:

- Create new MultiWordDisplay component (rejected: unnecessary duplication)
- Separate control panel for multiple words (rejected: inconsistent UX)
- Complete UI redesign (rejected: scope creep)

### Timing and Progress Calculation

**Decision**: Maintain existing WPM-based timing with consistent chunk duration regardless of word count.

**Rationale**: Specification FR-004 requires same total time per chunk regardless of word count to maintain consistent reading pace. This preserves the user's expected WPM experience.

**Implementation Approach**:

- Calculate msPerChunk = (60000 / WPM) regardless of word count
- Track progress by word position in original text array
- Recalculate progress percentage when word count changes during session
- Maintain deterministic timing for reproducible behavior

**Alternatives Considered**:

- Time proportional to word count (rejected: inconsistent with user WPM expectations)
- Variable timing based on word length (rejected: breaks deterministic behavior requirement)

### Data Storage and State Management

**Decision**: Use localStorage for persistence with key "speedreader.wordCount".

**Rationale**: Specification FR-010 requires localStorage persistence. The existing app appears to use React state management, so localStorage integration is straightforward.

**Implementation Approach**:

- Save word count to localStorage on change
- Restore word count on component mount
- Default to 1 word if no saved value exists
- Handle localStorage errors gracefully

**Alternatives Considered**:

- SessionStorage only (rejected: doesn't persist across sessions)
- IndexedDB (rejected: overkill for single preference value)
- No persistence (rejected: violates FR-010)

### Accessibility Implementation

**Decision**: Ensure full keyboard navigation and screen reader support.

**Rationale**: Constitution Principle III requires accessibility support. The dropdown control must be properly labeled and keyboard accessible.

**Implementation Approach**:

- Use semantic HTML select element with proper label
- Ensure keyboard navigation (arrow keys, Enter, Escape)
- Add ARIA labels for dynamic content changes
- Test with screen readers for proper announcement

**Alternatives Considered**:

- Custom dropdown implementation (rejected: accessibility challenges)
- No keyboard support (rejected: violates constitution)

### Performance Considerations

**Decision**: Optimize for 60fps display updates and <100ms UI response.

**Rationale**: Technical context specifies performance goals of 60fps and <100ms response time.

**Implementation Approach**:

- Use React.memo for components to prevent unnecessary re-renders
- Optimize word grouping algorithm to O(n) complexity
- Debounce localStorage saves to prevent blocking UI
- Use CSS text wrapping for overflow handling

**Alternatives Considered**:

- Complex caching systems (rejected: unnecessary overhead)
- Web Workers for text processing (rejected: overkill for text sizes involved)

## Technical Decisions Summary

| Component      | Decision                                         | Rationale                              |
| -------------- | ------------------------------------------------ | -------------------------------------- |
| Word Grouping  | Natural language boundaries + configurable count | Balances readability with user control |
| UI Integration | Extend existing components                       | Maintains architectural consistency    |
| Timing         | Fixed duration per chunk                         | Preserves WPM expectations             |
| Storage        | localStorage with specific key                   | Meets FR-010 requirement               |
| Accessibility  | Semantic HTML + ARIA                             | Constitution compliance                |
| Performance    | React optimization + CSS wrapping                | Meets performance goals                |

## Implementation Risks and Mitigations

| Risk                              | Impact | Mitigation                                           |
| --------------------------------- | ------ | ---------------------------------------------------- |
| Text wrapping affects readability | Medium | Test with various text lengths and screen sizes      |
| Progress calculation complexity   | Medium | Thorough testing of edge cases and state transitions |
| localStorage quota exceeded       | Low    | Graceful fallback to default settings                |
| Performance with large texts      | Low    | Implement efficient O(n) grouping algorithm          |

## Conclusion

All research questions have been resolved with clear technical decisions that align with the specification requirements and constitution principles. The implementation approach leverages existing React patterns while adding the multiple words functionality in a maintainable way.

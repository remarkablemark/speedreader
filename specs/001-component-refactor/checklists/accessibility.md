# Accessibility Checklist: Component Refactoring

**Purpose**: Verify accessibility compliance across all extracted components  
**Created**: 2026-02-14  
**Feature**: [Component Refactoring](./spec.md)

## Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order follows logical visual sequence
- [ ] Focus indicators are visible and meet contrast requirements
- [ ] No keyboard traps - all elements can be navigated away from

## Screen Reader Support

- [ ] All buttons have proper aria-labels or accessible text
- [ ] Form elements have associated labels and descriptions
- [ ] Dynamic content updates use aria-live regions appropriately
- [ ] Semantic HTML elements are used correctly (button, input, etc.)

## ARIA Attributes

- [ ] aria-live="polite" and aria-atomic="true" for reading display
- [ ] role="status" for current word display
- [ ] Proper aria-labels for speed slider and controls
- [ ] aria-expanded for collapsible session details
- [ ] aria-disabled for disabled buttons

## Color Contrast

- [ ] Text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- [ ] Interactive elements have sufficient contrast in all states
- [ ] Focus indicators meet contrast requirements
- [ ] Error messages are distinguishable from normal text

## Responsive Design

- [ ] All components work on mobile breakpoints (max-[480px])
- [ ] Touch targets meet minimum size requirements (44px)
- [ ] Text remains readable at smaller sizes
- [ ] No horizontal scroll on mobile devices

## Component-Specific Checks

### Button Component

- [ ] Primary and secondary variants have distinct visual states
- [ ] Disabled state is properly communicated
- [ ] Focus styles are consistent across variants
- [ ] Responsive sizing works on mobile

### TextInput Component

- [ ] Textarea has proper label association
- [ ] Validation errors are announced to screen readers
- [ ] Form submission prevention works with keyboard
- [ ] Placeholder text does not replace label

### ReadingDisplay Component

- [ ] Current word is properly announced
- [ ] Large text remains readable on mobile
- [ ] Focus management is appropriate
- [ ] Empty state is handled gracefully

### ControlPanel Component

- [ ] Speed slider has accessible labels
- [ ] Button state changes are announced
- [ ] Grouping of controls is logical
- [ ] Mobile touch targets are adequate

### SessionDetails Component

- [ ] Collapsible details are keyboard accessible
- [ ] Summary text is descriptive
- [ ] Progress information is clearly communicated
- [ ] Expand/collapse state is announced

### SessionCompletion Component

- [ ] Success message is properly announced
- [ ] Completion status is semantically correct
- [ ] Visual styling doesn't interfere with readability

## Testing Requirements

- [ ] Manual keyboard navigation testing completed
- [ ] Screen reader testing completed (VoiceOver/NVDA/JAWS)
- [ ] Automated accessibility testing completed
- [ ] Mobile accessibility testing completed

## Notes

- All components must maintain existing accessibility features
- New components should improve upon current accessibility where possible
- Test with actual assistive technology, not just automated tools

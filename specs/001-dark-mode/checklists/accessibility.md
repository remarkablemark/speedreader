# Accessibility & Responsive Test Checklist: Dark Mode

**Purpose**: Validate accessibility and responsive design for dark mode feature
**Created**: 2026-02-15
**Feature**: Dark Mode

## Keyboard Navigation

- [ ] ThemeToggle is focusable via Tab key
- [ ] ThemeToggle activates with Enter key
- [ ] ThemeToggle activates with Space key
- [ ] Focus indicator is visible (2px outline)
- [ ] Focus order is logical and predictable

## Semantics & ARIA

- [ ] ThemeToggle has proper ARIA label describing current state
- [ ] ThemeToggle role is "button"
- [ ] Theme changes are announced to screen readers
- [ ] No ARIA violations detected

## Responsive Design

- [ ] ThemeToggle is visible and functional on mobile (320px+)
- [ ] ThemeToggle is visible and functional on tablet (768px+)
- [ ] ThemeToggle is visible and functional on desktop (1024px+)
- [ ] Touch target meets minimum 48px × 48px requirement
- [ ] No layout shifts occur during theme transitions

## Color Contrast

- [ ] Light mode text meets WCAG AA contrast ratio (4.5:1)
- [ ] Dark mode text meets WCAG AA contrast ratio (4.5:1)
- [ ] Focus indicators meet contrast requirements
- [ ] Interactive elements meet contrast requirements

## High Contrast Mode

- [ ] High contrast mode is detected correctly
- [ ] High contrast mode overrides dark mode when active
- [ ] Theme remains functional in high contrast mode

## Reduced Motion

- [ ] Theme transitions respect prefers-reduced-motion
- [ ] No animations when reduced motion is preferred
- [ ] Functionality remains intact without animations

## Notes

- All items must be checked before feature is considered complete
- Use browser DevTools and accessibility testing tools for validation

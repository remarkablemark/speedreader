# Quickstart Guide: Component Refactoring Implementation

**Date**: 2026-02-14  
**Branch**: `001-component-refactor`

## Overview

This guide provides step-by-step instructions for implementing the component refactoring. The goal is to extract 6 components from the monolithic App.tsx while preserving all existing functionality and improving code maintainability.

## Prerequisites

- Ensure you're on the `001-component-refactor` branch
- Run `npm install` to ensure dependencies are up to date
- Verify existing tests pass: `npm run test:ci`

## Implementation Order

### Phase 1: Create Shared Infrastructure

1. **Create Button Component** (Foundation)

   ```bash
   mkdir -p src/components/Button
   touch src/components/Button/{Button.tsx,Button.types.ts,Button.test.tsx,index.ts}
   ```

2. **Create Shared Types**
   ```bash
   mkdir -p src/types
   touch src/types/{readerTypes.ts,index.ts}
   ```

### Phase 2: Extract Components (Dependency Order)

3. **Extract TextInput Component**
   - Move text input logic and validation
   - Colocate tokenizeContent utility
   - Test form submission and validation

4. **Extract ReadingDisplay Component**
   - Move current word display logic
   - Preserve ARIA attributes and styling
   - Test word display and accessibility

5. **Extract Button Component Usage**
   - Replace all inline button styles with Button component
   - Verify primary/secondary variants
   - Test responsive design and disabled states

6. **Extract ControlPanel Component**
   - Move speed slider and action buttons
   - Colocate useReadingSession hook
   - Test state-dependent button visibility

7. **Extract SessionDetails Component**
   - Move progress and tempo display
   - Test collapsible behavior and calculations

8. **Extract SessionCompletion Component**
   - Move completion messaging
   - Test success styling and timing display

### Phase 3: Integration and Cleanup

9. **Refactor App.tsx**
   - Remove extracted code
   - Import and use new components
   - Verify all functionality preserved

10. **Move Shared Types**
    - Extract shared interfaces to src/types/
    - Update component imports
    - Verify TypeScript compilation

## Development Commands

### During Implementation

```bash
# Run tests after each component extraction
npm run test:ci

# Type check after TypeScript changes
npm run lint:tsc

# Lint code after styling changes
npm run lint

# Start dev server for manual verification
npm start
```

### Final Verification

```bash
# Full test suite with coverage
npm run test:ci

# Type checking
npm run lint:tsc

# Linting
npm run lint

# Build verification
npm run build
```

## File Structure Reference

```
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
```

## Testing Strategy

### Unit Tests

- Each component has its own test file
- Test props, callbacks, and conditional rendering
- Verify accessibility attributes
- Test responsive design classes

### Integration Tests

- App.test.tsx verifies component integration
- Test full user workflows
- Verify state management through useReadingSession

### Coverage Requirements

- Maintain 100% test coverage
- All statements, branches, functions, and lines covered
- Use Vitest globals and Testing Library patterns

## Success Criteria

✅ **Component Extraction**: All 6 components extracted with proper interfaces  
✅ **DRY Principle**: Button styling duplication eliminated  
✅ **Functionality**: All existing features preserved  
✅ **Accessibility**: ARIA attributes and keyboard navigation maintained  
✅ **Testing**: 100% coverage maintained with component-specific tests  
✅ **Code Quality**: TypeScript strict mode compliance, no lint errors  
✅ **Performance**: No regressions in reading session timing

## Troubleshooting

### Common Issues

- **Import errors**: Verify barrel exports in index.ts files
- **Type errors**: Check shared types are properly imported
- **Test failures**: Ensure mock implementations match new component interfaces
- **Styling issues**: Verify Tailwind classes are preserved in Button variants

### Debug Commands

```bash
# Check specific component tests
npm test -- src/components/Button/Button.test.tsx

# Type check specific file
npx tsc --noEmit src/components/TextInput/TextInput.tsx

# Lint specific component
npx eslint src/components/ControlPanel/
```

## Next Steps

After completing the refactoring:

1. Run final verification commands
2. Update documentation if needed
3. Submit pull request with detailed description
4. Verify CI/CD pipeline passes
5. Merge to main branch

## Resources

- [Component Specification](./spec.md)
- [Data Model](./data-model.md)
- [Component Contracts](./contracts/component-interfaces.md)
- [Research Summary](./research.md)

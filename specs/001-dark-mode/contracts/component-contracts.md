# Component Contracts: Dark Mode

**Feature**: Dark Mode  
**Date**: 2026-02-15  
**Phase**: 1 - Design

## ThemeToggle Component Contract

### Interface Definition

```typescript
interface ThemeToggleProps {
  /** Current theme state */
  currentTheme: 'light' | 'dark' | 'system';
  /** Callback when theme is toggled */
  onThemeToggle: () => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether the toggle should be disabled */
  disabled?: boolean;
}
```

### Behavioral Contract

#### User Interactions

1. **Click Action**
   - **Trigger**: User clicks the toggle button
   - **Action**: Calls `onThemeToggle()` callback
   - **Visual Feedback**: Shows sun/moon icon transition with 300ms animation

2. **Keyboard Navigation**
   - **Tab Order**: Toggle must be focusable and included in tab sequence
   - **Enter/Space**: Activates toggle when focused
   - **Focus Indicator**: Visible focus state with 2px outline

3. **Screen Reader Support**
   - **ARIA Label**: "Toggle dark mode, currently {light/dark} mode"
   - **ARIA Role**: `button`
   - **State Announcement**: Theme change announced to screen readers

#### Visual Requirements

1. **Position**: Fixed position, bottom-right corner
2. **Size**: 48px × 48px minimum touch target
3. **Icons**: Sun icon for light mode, moon icon for dark mode
4. **Animation**: 300ms smooth rotation and color transition
5. **Hover State**: Slight scale increase (1.05) and background color change

### Accessibility Contract

```typescript
interface AccessibilityRequirements {
  /** Minimum touch target size in pixels */
  minTouchTarget: 48;
  /** Minimum color contrast ratio for normal text */
  minContrastRatio: 4.5;
  /** Animation duration in milliseconds */
  maxAnimationDuration: 300;
  /** Keyboard support required */
  keyboardSupport: true;
  /** Screen reader support required */
  screenReaderSupport: true;
}
```

## useTheme Hook Contract

### Interface Definition

```typescript
interface UseThemeReturn {
  /** Currently applied theme */
  theme: 'light' | 'dark';
  /** User's preference setting */
  preference: 'light' | 'dark' | 'system';
  /** Whether system preference is being followed */
  followingSystem: boolean;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  /** Set specific theme preference */
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  /** Whether high contrast mode is active */
  highContrastMode: boolean;
}
```

### Behavioral Contract

#### Theme Management

1. **Initialization**
   - Load preference from localStorage if available
   - Detect system theme as fallback
   - Apply theme before rendering to prevent flash

2. **Persistence**
   - Save user preference to localStorage on change
   - Include timestamp for debugging
   - Handle storage errors gracefully

3. **System Detection**
   - Listen for system theme changes
   - Update theme automatically when following system
   - Clean up listeners on unmount

#### Error Handling

```typescript
interface ErrorHandling {
  /** Fallback behavior when localStorage fails */
  localStorageFallback: 'system-preference';
  /** Behavior when JSON parsing fails */
  parseErrorFallback: 'use-system-preference';
  /** Behavior when media queries not supported */
  mediaQueryFallback: 'assume-no-preference';
}
```

**Approach**: Simple try-catch blocks following existing `storage.ts` pattern with silent failure and system preference fallback.

## Theme Utility Contract

### Interface Definition

```typescript
interface ThemeUtils {
  /** Get system theme preference */
  getSystemTheme: () => 'light' | 'dark' | 'no-preference';
  /** Check if high contrast mode is active */
  getHighContrastMode: () => boolean;
  /** Save theme preference to localStorage */
  saveThemePreference: (preference: ThemePreference) => boolean;
  /** Load theme preference from localStorage */
  loadThemePreference: () => ThemePreference | null;
  /** Validate theme preference object */
  validateThemePreference: (data: unknown) => data is ThemePreference;
}
```

### Storage Contract

#### localStorage Schema

```typescript
interface StorageContract {
  /** Storage key for theme preference */
  key: 'speedreader-theme-preference';
  /** Data format stored */
  format: {
    theme: 'light' | 'dark' | 'system';
    persist: boolean;
    lastChanged: number;
  };
  /** Maximum storage size */
  maxSize: 1024; // bytes
}
```

#### Error Handling

Follow existing codebase pattern with simple try-catch blocks:

```typescript
interface ErrorHandling {
  /** Fallback behavior when localStorage fails */
  localStorageFallback: 'system-preference';
  /** Error handling approach */
  errorStrategy: 'silent-failure-with-default';
}
```

**Storage Operations**:

- All localStorage operations wrapped in try-catch blocks
- On any error, fall back to system preference
- No explicit error logging or data corruption detection
- Follows same pattern as existing `storage.ts` utility

## Integration Contract

### App Component Integration

```typescript
interface AppThemeIntegration {
  /** Theme provider must wrap entire app */
  providerLocation: 'root';
  /** Theme must be applied before first render */
  initializationTiming: 'before-render';
  /** Theme changes must not cause layout shifts */
  layoutStability: 'no-shift';
  /** Theme transitions must respect motion preferences */
  motionRespect: 'honor-prefers-reduced-motion';
}
```

### CSS Integration

```typescript
interface CSSIntegration {
  /** Tailwind class strategy */
  tailwindStrategy: 'class';
  /** Custom properties for theme colors */
  cssVariables: boolean;
  /** Transition duration */
  transitionDuration: '300ms';
  /** Transition easing */
  transitionEasing: 'ease-in-out';
}
```

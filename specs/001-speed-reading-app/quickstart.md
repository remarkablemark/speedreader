# Quickstart: Speed Reading App Feature

## Prerequisites

- Node.js 24+
- npm

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm start
   ```
3. Open `http://127.0.0.1:5173`.

## Core user flow validation

1. Paste or type text in setup mode.
2. Confirm default speed is 250 WPM on first use.
3. Adjust speed with slider (100-1000).
4. Select **Start Reading**.
5. Verify one word displays at a time and advances at configured pace.
6. Use controls and shortcuts:
   - `Space`: play/pause
   - `R`: restart
   - `ArrowUp` / `ArrowDown`: +/- 10 WPM
   - `Home` / `End`: min/max speed
7. Confirm progress (`words read / total` and percentage) updates live.
8. Confirm completion summary appears at final word.
9. Select **Edit Text** and verify return to setup mode.
10. Refresh page and verify active session state resets to start.

## Quality gates

Run before merge:

```bash
npm run lint
npm run lint:tsc
npm run test:ci
```

## Suggested test focus

- Deterministic word progression and timing behavior (fake timers).
- Pause/resume/restart transition correctness.
- Speed persistence and first-run default fallback.
- Keyboard accessibility and shortcut coverage.
- Responsive behavior for single-row controls and flash-word sizing.

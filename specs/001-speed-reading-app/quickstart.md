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
4. Select **Read**.
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
- Pause/play/restart transition correctness.
- Speed persistence and first-run default fallback.
- Keyboard accessibility and shortcut coverage.
- Responsive behavior for single-row controls and flash-word sizing.

## Manual validation protocol (SC-001..SC-004)

### SC-001: Timed first-run start latency

1. Open a fresh browser profile (or clear site data).
2. Start the app and paste `SESSION_TEXT.shortParagraph`-length content (about 10-20 words).
3. Confirm the default speed shows **250 WPM** before starting.
4. Click **Read** and confirm the `data-testid="start-latency-marker"` is present and increments.
5. Visually confirm the first word appears immediately after session start and then advances on cadence.

### SC-002: Interruption tolerance (pause/play/restart)

1. Start a reading session with at least 8 words.
2. Pause after 2-3 words and verify the displayed word remains stable while paused.
3. Play and verify progression continues from the same position.
4. Trigger restart (button or `R`) and confirm reading restarts from word 1.
5. Confirm the `data-testid="restart-marker"` value increments on each restart.

### SC-003: Comprehension-check pacing control

1. Start with medium text and set WPM to **200**.
2. Confirm cadence is visibly slower than default.
3. Increase speed with slider and `ArrowUp`; decrease with `ArrowDown`.
4. Use `Home` and `End` to jump to min/max speeds and verify displayed WPM updates.
5. Confirm changes apply on the next tick without resetting session position.

### SC-004: Repeat-session completion behavior

1. Run a short session to completion.
2. Verify completion summary shows words read and elapsed milliseconds.
3. Confirm `data-testid="session-completion-marker"` is present in completed state.
4. Restart and complete a second run without page refresh.
5. Click **Edit Text** and confirm setup mode returns and a new session can be started.

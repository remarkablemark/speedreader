# Data Model: Speed Reading App

## 1) ReadingContent

Represents parsed input text used in a single reading session.

| Field        | Type       | Required | Description                                        |
| ------------ | ---------- | -------- | -------------------------------------------------- |
| `rawText`    | `string`   | Yes      | User-entered or pasted source text.                |
| `words`      | `string[]` | Yes      | Ordered canonical sequence derived from `rawText`. |
| `totalWords` | `number`   | Yes      | Count of parsed words (`words.length`).            |

### Validation Rules

- `rawText.trim()` must be non-empty to start a session (FR-008).
- `words` must preserve source order (FR-002, FR-004).
- No fixed upper bound on `totalWords` (FR-014).

## 2) ReaderPreferences

Represents reusable per-device settings.

| Field          | Type     | Required | Description                                      |
| -------------- | -------- | -------- | ------------------------------------------------ |
| `preferredWpm` | `number` | Yes      | Last selected reading speed persisted on device. |
| `minWpm`       | `number` | Yes      | Lower speed bound (100).                         |
| `maxWpm`       | `number` | Yes      | Upper speed bound (1000).                        |
| `speedStep`    | `number` | Yes      | Increment for keyboard arrow adjustment (10).    |

### Validation Rules

- `preferredWpm` must always be clamped to `[minWpm, maxWpm]` (FR-005, FR-013).
- First-time default is `250` when no saved value exists (FR-012).

## 3) ReadingSession

Represents one timed playback run over `ReadingContent`.

| Field              | Type                                             | Required | Description                                      |
| ------------------ | ------------------------------------------------ | -------- | ------------------------------------------------ |
| `status`           | `'idle' \| 'running' \| 'paused' \| 'completed'` | Yes      | Current session lifecycle state.                 |
| `currentWordIndex` | `number`                                         | Yes      | Zero-based index of currently displayed word.    |
| `wordsRead`        | `number`                                         | Yes      | Number of words already shown.                   |
| `selectedWpm`      | `number`                                         | Yes      | Active playback speed.                           |
| `msPerWord`        | `number`                                         | Yes      | Derived timing interval (`60000 / selectedWpm`). |
| `elapsedMs`        | `number`                                         | Yes      | Elapsed active session duration for summary.     |
| `startedAtMs`      | `number \| null`                                 | No       | Timestamp for active run start.                  |
| `pausedAtMs`       | `number \| null`                                 | No       | Timestamp captured when pausing.                 |

### Derived Values

- `progressPercent = totalWords === 0 ? 0 : (wordsRead / totalWords) * 100` (FR-006).
- Completion summary includes `elapsedMs` and `wordsRead` when `status === 'completed'` (FR-007).

## Relationships

- `ReadingSession` references one `ReadingContent` instance.
- `ReadingSession.selectedWpm` initializes from `ReaderPreferences.preferredWpm` and writes back on change.

## State Transitions

| Action       | From                             | To          | Notes                                                    |
| ------------ | -------------------------------- | ----------- | -------------------------------------------------------- |
| `initialize` | N/A                              | `idle`      | New app load; no active session restored (FR-011).       |
| `start`      | `idle`                           | `running`   | Requires valid `ReadingContent`.                         |
| `pause`      | `running`                        | `paused`    | Retains `currentWordIndex`.                              |
| `resume`     | `paused`                         | `running`   | Continues from retained index.                           |
| `restart`    | `running \| paused \| completed` | `running`   | Sets index to first word; keeps selected speed.          |
| `complete`   | `running`                        | `completed` | Triggered at final word.                                 |
| `editText`   | `running \| paused \| completed` | `idle`      | Returns to setup mode with text editor visible (FR-018). |

export const SESSION_TEXT = {
  singleWord: 'Read',
  shortParagraph: 'Focus on one word at a time and keep breathing steadily.',
  mediumParagraph:
    'Speed reading sessions should remain deterministic so tests can verify each word transition under fake timers.',
  largeText: Array.from(
    { length: 2000 },
    (_, index) => 'token-' + String(index + 1),
  ).join(' '),
};

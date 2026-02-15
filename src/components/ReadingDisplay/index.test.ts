import { expect, test } from 'vitest';

import * as ReadingDisplayModule from './index';

describe('ReadingDisplay index', () => {
  test('exports ReadingDisplay component', () => {
    expect(ReadingDisplayModule.ReadingDisplay).toBeDefined();
    expect(typeof ReadingDisplayModule.ReadingDisplay).toBe('function');
  });

  test('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(ReadingDisplayModule)).toContain('ReadingDisplay');
  });
});

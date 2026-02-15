import { expect, test } from 'vitest';

import * as SessionDetailsModule from './index';

describe('SessionDetails index', () => {
  test('exports SessionDetails component', () => {
    expect(SessionDetailsModule.SessionDetails).toBeDefined();
    expect(typeof SessionDetailsModule.SessionDetails).toBe('function');
  });

  test('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(SessionDetailsModule)).toContain('SessionDetails');
  });
});

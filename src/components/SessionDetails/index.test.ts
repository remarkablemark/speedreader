import { expect } from 'vitest';

import * as SessionDetailsModule from './index';

describe('SessionDetails index', () => {
  it('exports SessionDetails component', () => {
    expect(SessionDetailsModule.SessionDetails).toBeDefined();
    expect(typeof SessionDetailsModule.SessionDetails).toBe('function');
  });

  it('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(SessionDetailsModule)).toContain('SessionDetails');
  });
});

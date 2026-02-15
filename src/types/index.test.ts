import { expect } from 'vitest';

import * as TypesModule from './index';

describe('types index', () => {
  it('module structure is correct', () => {
    // Check that the module has the expected export structure
    const keys = Object.keys(TypesModule);
    expect(keys.length).toBe(0); // Only type exports, no runtime exports
  });
});

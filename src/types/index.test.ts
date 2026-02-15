import { expect, test } from 'vitest';

import * as TypesModule from './index';

describe('types index', () => {
  test('module structure is correct', () => {
    // Check that the module has the expected export structure
    const keys = Object.keys(TypesModule);
    expect(keys.length).toBe(0); // Only type exports, no runtime exports
  });
});

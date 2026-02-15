import { expect, test } from 'vitest';

import * as ButtonModule from './index';

describe('Button index', () => {
  test('exports Button component', () => {
    expect(ButtonModule.Button).toBeDefined();
    expect(typeof ButtonModule.Button).toBe('function');
  });

  test('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(ButtonModule)).toContain('Button');
  });
});

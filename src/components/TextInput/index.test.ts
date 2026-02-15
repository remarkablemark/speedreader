import { expect, test } from 'vitest';

import * as TextInputModule from './index';

describe('TextInput index', () => {
  test('exports TextInput component', () => {
    expect(TextInputModule.TextInput).toBeDefined();
    expect(typeof TextInputModule.TextInput).toBe('function');
  });

  test('exports hasReadableText function', () => {
    expect(TextInputModule.hasReadableText).toBeDefined();
    expect(typeof TextInputModule.hasReadableText).toBe('function');
  });

  test('exports tokenizeContent function', () => {
    expect(TextInputModule.tokenizeContent).toBeDefined();
    expect(typeof TextInputModule.tokenizeContent).toBe('function');
  });

  test('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(TextInputModule)).toContain('TextInput');
    expect(Object.keys(TextInputModule)).toContain('hasReadableText');
    expect(Object.keys(TextInputModule)).toContain('tokenizeContent');
  });
});

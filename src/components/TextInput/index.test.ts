import { expect } from 'vitest';

import * as TextInputModule from './index';

describe('TextInput index', () => {
  it('exports TextInput component', () => {
    expect(TextInputModule.TextInput).toBeDefined();
    expect(typeof TextInputModule.TextInput).toBe('function');
  });

  it('exports hasReadableText function', () => {
    expect(TextInputModule.hasReadableText).toBeDefined();
    expect(typeof TextInputModule.hasReadableText).toBe('function');
  });

  it('exports tokenizeContent function', () => {
    expect(TextInputModule.tokenizeContent).toBeDefined();
    expect(typeof TextInputModule.tokenizeContent).toBe('function');
  });

  it('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(TextInputModule)).toContain('TextInput');
    expect(Object.keys(TextInputModule)).toContain('hasReadableText');
    expect(Object.keys(TextInputModule)).toContain('tokenizeContent');
  });
});

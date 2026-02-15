import { expect, test } from 'vitest';

import * as ControlPanelModule from './index';

describe('ControlPanel index', () => {
  test('exports ControlPanel component', () => {
    expect(ControlPanelModule.ControlPanel).toBeDefined();
    expect(typeof ControlPanelModule.ControlPanel).toBe('function');
  });

  test('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(ControlPanelModule)).toContain('ControlPanel');
  });
});

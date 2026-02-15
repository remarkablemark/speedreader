import { expect } from 'vitest';

import * as ControlPanelModule from './index';

describe('ControlPanel index', () => {
  it('exports ControlPanel component', () => {
    expect(ControlPanelModule.ControlPanel).toBeDefined();
    expect(typeof ControlPanelModule.ControlPanel).toBe('function');
  });

  it('module structure is correct', () => {
    // Check that the module has the expected export structure
    expect(Object.keys(ControlPanelModule)).toContain('ControlPanel');
  });
});

import App from './App';
import AppFromIndex from './index';

describe('App module index', () => {
  it('re-exports App as the default export', () => {
    expect(AppFromIndex).toBe(App);
  });
});

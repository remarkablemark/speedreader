import { SESSION_TEXT } from './__fixtures__/sessionText';
import { hasReadableText, tokenizeContent } from './tokenizeContent';

describe('tokenizeContent', () => {
  it('returns false for empty or whitespace text', () => {
    expect(hasReadableText('')).toBe(false);
    expect(hasReadableText('   \n\t')).toBe(false);
  });

  it('returns true for readable input', () => {
    expect(hasReadableText('hello')).toBe(true);
  });

  it('returns empty token payload when text is unreadable', () => {
    expect(tokenizeContent('  ')).toEqual({ words: [], totalWords: 0 });
  });

  it('tokenizes words by whitespace while preserving order', () => {
    expect(tokenizeContent('alpha   beta\n gamma\t delta')).toEqual({
      words: ['alpha', 'beta', 'gamma', 'delta'],
      totalWords: 4,
    });
  });

  it('supports one-word and very-large text inputs', () => {
    expect(tokenizeContent(SESSION_TEXT.singleWord)).toEqual({
      words: ['Read'],
      totalWords: 1,
    });

    const largeTokenized = tokenizeContent(SESSION_TEXT.largeText);
    expect(largeTokenized.totalWords).toBe(2000);
    expect(largeTokenized.words[0]).toBe('token-1');
    expect(largeTokenized.words[1999]).toBe('token-2000');
  });
});

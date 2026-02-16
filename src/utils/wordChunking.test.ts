import { generateWordChunks } from './wordChunking';

describe('wordChunking', () => {
  it('generates chunks correctly for basic input', () => {
    const words = ['one', 'two', 'three', 'four', 'five'];
    const chunks = generateWordChunks(words, 2);

    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toEqual({
      text: 'one two',
      words: ['one', 'two'],
    });
    expect(chunks[1]).toEqual({
      text: 'three four',
      words: ['three', 'four'],
    });
    expect(chunks[2]).toEqual({
      text: 'five',
      words: ['five'],
    });
  });

  it('handles single word per chunk', () => {
    const words = ['one', 'two', 'three'];
    const chunks = generateWordChunks(words, 1);

    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toEqual({
      text: 'one',
      words: ['one'],
    });
    expect(chunks[1]).toEqual({
      text: 'two',
      words: ['two'],
    });
    expect(chunks[2]).toEqual({
      text: 'three',
      words: ['three'],
    });
  });

  it('handles multiple words per chunk', () => {
    const words = ['one', 'two', 'three', 'four', 'five', 'six'];
    const chunks = generateWordChunks(words, 3);

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toEqual({
      text: 'one two three',
      words: ['one', 'two', 'three'],
    });
    expect(chunks[1]).toEqual({
      text: 'four five six',
      words: ['four', 'five', 'six'],
    });
  });

  it('handles empty words array', () => {
    const chunks = generateWordChunks([], 2);
    expect(chunks).toEqual([]);
  });

  it('handles invalid wordsPerChunk values', () => {
    const words = ['one', 'two', 'three'];

    // Test 0 words per chunk
    expect(generateWordChunks(words, 0)).toEqual([]);

    // Test negative words per chunk
    expect(generateWordChunks(words, -1)).toEqual([]);

    // Test too large words per chunk
    expect(generateWordChunks(words, 10)).toEqual([]);
  });

  it('handles edge case with exact division', () => {
    const words = ['one', 'two', 'three', 'four'];
    const chunks = generateWordChunks(words, 2);

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toEqual({
      text: 'one two',
      words: ['one', 'two'],
    });
    expect(chunks[1]).toEqual({
      text: 'three four',
      words: ['three', 'four'],
    });
  });

  it('handles edge case with single word', () => {
    const words = ['single'];
    const chunks = generateWordChunks(words, 2);

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual({
      text: 'single',
      words: ['single'],
    });
  });

  it('handles edge case with wordsPerChunk greater than word count', () => {
    const words = ['one', 'two'];
    const chunks = generateWordChunks(words, 5);

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual({
      text: 'one two',
      words: ['one', 'two'],
    });
  });

  it('preserves word order', () => {
    const words = ['first', 'second', 'third', 'fourth', 'fifth'];
    const chunks = generateWordChunks(words, 2);

    expect(chunks[0].words).toEqual(['first', 'second']);
    expect(chunks[1].words).toEqual(['third', 'fourth']);
    expect(chunks[2].words).toEqual(['fifth']);
  });

  it('handles words with special characters', () => {
    const words = ['hello-world', "it's", 'test'];
    const chunks = generateWordChunks(words, 2);

    expect(chunks).toHaveLength(2);
    expect(chunks[0].text).toBe("hello-world it's");
    expect(chunks[1].text).toBe('test');
  });
});

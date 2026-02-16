import { render, screen } from '@testing-library/react';

import { ReadingDisplay } from './ReadingDisplay';

describe('ReadingDisplay', () => {
  it('renders current word when hasWords is true and wordsPerChunk is 1', () => {
    render(
      <ReadingDisplay
        currentWord="hello"
        currentChunk={null}
        wordsPerChunk={1}
        hasWords={true}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('hello');
  });

  it('renders chunk text when wordsPerChunk > 1 and currentChunk is provided', () => {
    const chunk = { text: 'hello world', words: ['hello', 'world'] };
    render(
      <ReadingDisplay
        currentWord="hello"
        currentChunk={chunk}
        wordsPerChunk={2}
        hasWords={true}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('hello world');
  });

  it('renders current word when wordsPerChunk > 1 but currentChunk is null', () => {
    render(
      <ReadingDisplay
        currentWord="hello"
        currentChunk={null}
        wordsPerChunk={2}
        hasWords={true}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('hello');
  });

  it('renders empty word when hasWords is true but currentWord is empty', () => {
    render(
      <ReadingDisplay
        currentWord=""
        currentChunk={null}
        wordsPerChunk={1}
        hasWords={true}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('');
  });

  it('renders empty word when hasWords is false', () => {
    render(
      <ReadingDisplay
        currentWord="hello"
        currentChunk={null}
        wordsPerChunk={1}
        hasWords={false}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('');
  });

  it('has proper accessibility attributes', () => {
    render(
      <ReadingDisplay
        currentWord="test"
        currentChunk={null}
        wordsPerChunk={1}
        hasWords={true}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).toHaveAttribute('aria-live', 'polite');
    expect(wordElement).toHaveAttribute('aria-atomic', 'true');
  });

  it('has responsive styling classes', () => {
    render(
      <ReadingDisplay
        currentWord="test"
        currentChunk={null}
        wordsPerChunk={1}
        hasWords={true}
      />,
    );

    const displayContainer = document.querySelector('.flex.min-h-40');
    expect(displayContainer).toBeInTheDocument();

    // Check mobile responsive classes
    expect(displayContainer).toHaveClass('max-[480px]:min-h-[8.5rem]');
  });

  it('has proper typography styling', () => {
    render(
      <ReadingDisplay
        currentWord="test"
        currentChunk={null}
        wordsPerChunk={1}
        hasWords={true}
      />,
    );

    const displayContainer = document.querySelector('.flex.min-h-40');
    expect(displayContainer).toHaveClass(
      'text-[48px]',
      'leading-[1.1]',
      'font-semibold',
      'tracking-wide',
      'text-slate-900',
      'max-[480px]:text-[2rem]',
    );
  });

  it('applies break-words class when wordsPerChunk > 1', () => {
    const chunk = {
      text: 'hello world test',
      words: ['hello', 'world', 'test'],
    };
    render(
      <ReadingDisplay
        currentWord="hello"
        currentChunk={chunk}
        wordsPerChunk={3}
        hasWords={true}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).toHaveClass('break-words');
  });

  it('does not apply break-words class when wordsPerChunk is 1', () => {
    render(
      <ReadingDisplay
        currentWord="test"
        currentChunk={null}
        wordsPerChunk={1}
        hasWords={true}
      />,
    );

    const wordElement = screen.getByRole('status');
    expect(wordElement).not.toHaveClass('break-words');
  });
});

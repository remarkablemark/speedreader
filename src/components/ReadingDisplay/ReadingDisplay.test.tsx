import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ReadingDisplay } from './ReadingDisplay';

describe('ReadingDisplay', () => {
  it('renders current word when hasWords is true', () => {
    render(<ReadingDisplay currentWord="hello" hasWords={true} />);

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('hello');
  });

  it('renders empty word when hasWords is true but currentWord is empty', () => {
    render(<ReadingDisplay currentWord="" hasWords={true} />);

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('');
  });

  it('renders empty word when hasWords is false', () => {
    render(<ReadingDisplay currentWord="hello" hasWords={false} />);

    const wordElement = screen.getByRole('status');
    expect(wordElement).toBeInTheDocument();
    expect(wordElement).toHaveTextContent('');
  });

  it('has proper accessibility attributes', () => {
    render(<ReadingDisplay currentWord="test" hasWords={true} />);

    const wordElement = screen.getByRole('status');
    expect(wordElement).toHaveAttribute('aria-live', 'polite');
    expect(wordElement).toHaveAttribute('aria-atomic', 'true');
  });

  it('has responsive styling classes', () => {
    render(<ReadingDisplay currentWord="test" hasWords={true} />);

    const displayContainer = document.querySelector('.flex.min-h-40');
    expect(displayContainer).toBeInTheDocument();

    // Check mobile responsive classes
    expect(displayContainer).toHaveClass('max-[480px]:min-h-[8.5rem]');
  });

  it('has proper typography styling', () => {
    render(<ReadingDisplay currentWord="test" hasWords={true} />);

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
});

import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { SessionCompletion } from './SessionCompletion';
import type { SessionCompletionProps } from './SessionCompletion.types';

describe('SessionCompletion', () => {
  const defaultProps: SessionCompletionProps = {
    wordsRead: 100,
    elapsedMs: 24000,
  };

  it('renders completion message with heading', () => {
    render(<SessionCompletion {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Session complete');
  });

  it('displays word count correctly', () => {
    render(<SessionCompletion {...defaultProps} />);

    expect(screen.getByText(/You read 100 words/)).toBeInTheDocument();
  });

  it('displays elapsed time correctly', () => {
    render(<SessionCompletion {...defaultProps} />);

    expect(screen.getByText(/in 24000 ms/)).toBeInTheDocument();
  });

  it('displays full completion message', () => {
    render(<SessionCompletion {...defaultProps} />);

    const message = screen.getByText(/You read 100 words in 24000 ms/);
    expect(message).toBeInTheDocument();
  });

  it('handles zero values gracefully', () => {
    const zeroProps: SessionCompletionProps = {
      wordsRead: 0,
      elapsedMs: 0,
    };

    render(<SessionCompletion {...zeroProps} />);

    expect(screen.getByText(/You read 0 words in 0 ms/)).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<SessionCompletion {...defaultProps} />);

    const container = screen.getByText(/Session complete/).parentElement;
    expect(container).toHaveClass(
      'rounded-md',
      'border',
      'border-emerald-200',
      'bg-emerald-50',
      'p-4',
      'text-sm',
      'text-emerald-900',
    );
  });

  it('uses semantic h2 heading', () => {
    render(<SessionCompletion {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('font-semibold');
  });

  it('formats message with different values', () => {
    const props: SessionCompletionProps = {
      wordsRead: 250,
      elapsedMs: 60000,
    };

    render(<SessionCompletion {...props} />);

    expect(
      screen.getByText(/You read 250 words in 60000 ms/),
    ).toBeInTheDocument();
  });

  it('wraps content in proper container structure', () => {
    render(<SessionCompletion {...defaultProps} />);

    const container = screen.getByRole('heading', { level: 2 }).parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('rounded-md', 'border-emerald-200');
  });
});

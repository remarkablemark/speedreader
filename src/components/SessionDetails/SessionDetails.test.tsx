import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { SessionDetails } from './SessionDetails';
import type { SessionDetailsProps } from './SessionDetails.types';

describe('SessionDetails', () => {
  const defaultProps: SessionDetailsProps = {
    wordsRead: 25,
    totalWords: 100,
    progressPercent: 25,
    msPerWord: 240,
  };

  it('renders collapsible details with summary', () => {
    render(<SessionDetails {...defaultProps} />);

    const summary = screen.getByText('Session details');
    expect(summary).toBeInTheDocument();
    expect(summary.tagName).toBe('SUMMARY');
  });

  it('displays progress information correctly', () => {
    render(<SessionDetails {...defaultProps} />);

    expect(screen.getByText(/Progress:/)).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument(); // wordsRead
    expect(screen.getByText('100')).toBeInTheDocument(); // totalWords
    expect(screen.getByText(/25%/)).toBeInTheDocument(); // progressPercent
  });

  it('displays tempo information correctly', () => {
    render(<SessionDetails {...defaultProps} />);

    expect(screen.getByText(/Tempo:/)).toBeInTheDocument();
    expect(screen.getByText('240')).toBeInTheDocument();
    expect(screen.getByText(/milliseconds\/word/)).toBeInTheDocument();
  });

  it('rounds percentage and ms/word values', () => {
    const propsWithDecimals: SessionDetailsProps = {
      wordsRead: 33,
      totalWords: 100,
      progressPercent: 33.33,
      msPerWord: 333.33,
    };

    render(<SessionDetails {...propsWithDecimals} />);

    expect(screen.getByText('33')).toBeInTheDocument(); // wordsRead
    expect(screen.getByText('100')).toBeInTheDocument(); // totalWords
    expect(screen.getByText(/33%/)).toBeInTheDocument(); // progressPercent
    expect(screen.getByText('333', { exact: false })).toBeInTheDocument(); // msPerWord
  });

  it('handles zero values gracefully', () => {
    const zeroProps: SessionDetailsProps = {
      wordsRead: 0,
      totalWords: 0,
      progressPercent: 0,
      msPerWord: 240,
    };

    render(<SessionDetails {...zeroProps} />);

    expect(screen.getAllByText('0')).toHaveLength(2); // wordsRead, totalWords (progressPercent is in a different format)
    expect(screen.getByText(/0%/)).toBeInTheDocument(); // progressPercent
    expect(screen.getByText('240', { exact: false })).toBeInTheDocument(); // msPerWord
  });

  it('has proper accessibility attributes', () => {
    render(<SessionDetails {...defaultProps} />);

    const detailsElement = screen.getByRole('group');
    expect(detailsElement).toBeInTheDocument();
    expect(detailsElement.tagName).toBe('DETAILS');

    const liveRegion = screen.getByText(/Progress:/).parentElement;
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('uses semantic details element', () => {
    render(<SessionDetails {...defaultProps} />);

    const detailsElement = screen.getByRole('group');
    expect(detailsElement).toBeInTheDocument();
    expect(detailsElement).toHaveClass('m-0');
  });

  it('formats progress text correctly', () => {
    render(<SessionDetails {...defaultProps} />);

    const progressText = screen.getByText(/Progress:/).parentElement;
    expect(progressText).toHaveTextContent('Progress: 25 / 100 (25%)');
  });

  it('formats tempo text correctly', () => {
    render(<SessionDetails {...defaultProps} />);

    const tempoText = screen.getByText(/Tempo:/).parentElement;
    expect(tempoText).toHaveTextContent('Tempo: 240 milliseconds/word');
  });
});

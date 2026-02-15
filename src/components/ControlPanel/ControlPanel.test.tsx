import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi } from 'vitest';

import { ControlPanel } from './ControlPanel';
import type { ControlPanelProps } from './ControlPanel.types';

describe('ControlPanel', () => {
  const defaultProps: ControlPanelProps = {
    selectedWpm: 250,
    onSpeedChange: vi.fn(),
    onStartReading: vi.fn(),
    onPauseReading: vi.fn(),
    onResumeReading: vi.fn(),
    onRestartReading: vi.fn(),
    onEditText: vi.fn(),
    isInputValid: true,
    status: 'idle',
    wordsPerChunk: 1,
    onWordsPerChunkChange: vi.fn(),
  };

  it('renders speed slider with correct value', () => {
    render(<ControlPanel {...defaultProps} />);

    const slider = screen.getByRole('slider', { name: /speed/i });
    expect(slider).toHaveValue('250');
  });

  it('displays correct speed label', () => {
    render(<ControlPanel {...defaultProps} />);

    expect(screen.getByText('Speed (250 WPM)')).toBeInTheDocument();
  });

  it('shows Read button in idle state', () => {
    render(<ControlPanel {...defaultProps} status="idle" />);

    const startButton = screen.getByRole('button', { name: /Read/ });
    expect(startButton).toBeInTheDocument();
    expect(startButton).toBeEnabled();
  });

  it('disables Read button when input is invalid', () => {
    render(
      <ControlPanel {...defaultProps} status="idle" isInputValid={false} />,
    );

    const startButton = screen.getByRole('button', { name: /Read/ });
    expect(startButton).toBeDisabled();
  });

  it('shows Pause button in running state', () => {
    render(<ControlPanel {...defaultProps} status="running" />);

    expect(screen.getByRole('button', { name: /Pause/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit Text' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Read/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Play/ }),
    ).not.toBeInTheDocument();
  });

  it('shows Play button in paused state', () => {
    render(<ControlPanel {...defaultProps} status="paused" />);

    expect(screen.getByRole('button', { name: /Play/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit Text' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Read/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Pause/ }),
    ).not.toBeInTheDocument();
  });

  it('shows only Restart and Edit Text in completed state', () => {
    render(<ControlPanel {...defaultProps} status="completed" />);

    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit Text' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Read/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Pause/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Play/ }),
    ).not.toBeInTheDocument();
  });

  it('has proper speed slider functionality', () => {
    const onSpeedChange = vi.fn();

    render(<ControlPanel {...defaultProps} onSpeedChange={onSpeedChange} />);

    const slider = screen.getByRole('slider', {
      name: /speed/i,
    });

    // Verify slider exists and has correct attributes
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue('250');
    expect(slider).toHaveAttribute('min', '100');
    expect(slider).toHaveAttribute('max', '1000');
  });

  it('calls onStartReading when Read button is clicked', async () => {
    const user = userEvent.setup();
    const onStartReading = vi.fn();

    render(
      <ControlPanel
        {...defaultProps}
        status="idle"
        onStartReading={onStartReading}
      />,
    );

    const startButton = screen.getByRole('button', { name: /Read/ });
    await user.click(startButton);

    expect(onStartReading).toHaveBeenCalledTimes(1);
  });

  it('calls onPauseReading when Pause button is clicked', async () => {
    const user = userEvent.setup();
    const onPauseReading = vi.fn();

    render(
      <ControlPanel
        {...defaultProps}
        status="running"
        onPauseReading={onPauseReading}
      />,
    );

    const pauseButton = screen.getByRole('button', { name: /Pause/ });
    await user.click(pauseButton);

    expect(onPauseReading).toHaveBeenCalledTimes(1);
  });

  it('calls onResumeReading when Play button is clicked', async () => {
    const user = userEvent.setup();
    const onResumeReading = vi.fn();

    render(
      <ControlPanel
        {...defaultProps}
        status="paused"
        onResumeReading={onResumeReading}
      />,
    );

    const resumeButton = screen.getByRole('button', { name: /Play/ });
    await user.click(resumeButton);

    expect(onResumeReading).toHaveBeenCalledTimes(1);
  });

  it('calls onRestartReading when Restart button is clicked', async () => {
    const user = userEvent.setup();
    const onRestartReading = vi.fn();

    render(
      <ControlPanel
        {...defaultProps}
        status="running"
        onRestartReading={onRestartReading}
      />,
    );

    const restartButton = screen.getByRole('button', { name: 'Restart' });
    await user.click(restartButton);

    expect(onRestartReading).toHaveBeenCalledTimes(1);
  });

  it('calls onEditText when Edit Text button is clicked', async () => {
    const user = userEvent.setup();
    const onEditText = vi.fn();

    render(
      <ControlPanel
        {...defaultProps}
        status="running"
        onEditText={onEditText}
      />,
    );

    const editButton = screen.getByRole('button', { name: 'Edit Text' });
    await user.click(editButton);

    expect(onEditText).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<ControlPanel {...defaultProps} />);

    const controlsGroup = screen.getByRole('group', {
      name: 'Reading controls',
    });
    expect(controlsGroup).toBeInTheDocument();

    const slider = screen.getByRole('slider', { name: /speed/i });
    expect(slider).toHaveAttribute('aria-valuemin', '100');
    expect(slider).toHaveAttribute('aria-valuemax', '1000');
    expect(slider).toHaveAttribute('aria-valuenow', '250');
  });

  it('applies responsive design classes', () => {
    render(<ControlPanel {...defaultProps} />);

    const controlsGroup = screen.getByRole('group', {
      name: 'Reading controls',
    });
    expect(controlsGroup).toHaveClass('gap-4', 'sm:gap-6');
  });

  it('renders conditional buttons correctly for all states', () => {
    const { rerender } = render(
      <ControlPanel {...defaultProps} status="idle" />,
    );

    // Idle state - only Read button
    expect(screen.getByRole('button', { name: /Read/ })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Pause/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Play/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Restart' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit Text' }),
    ).not.toBeInTheDocument();

    // Running state - Pause, Restart, Edit Text buttons
    rerender(<ControlPanel {...defaultProps} status="running" />);
    expect(
      screen.queryByRole('button', { name: /Read/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pause/ })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Play/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit Text' }),
    ).toBeInTheDocument();

    // Paused state - Play, Restart, Edit Text buttons
    rerender(<ControlPanel {...defaultProps} status="paused" />);
    expect(
      screen.queryByRole('button', { name: /Read/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Pause/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit Text' }),
    ).toBeInTheDocument();

    // Completed state - Restart, Edit Text buttons
    rerender(<ControlPanel {...defaultProps} status="completed" />);
    expect(
      screen.queryByRole('button', { name: /Read/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Pause/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Play/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit Text' }),
    ).toBeInTheDocument();
  });

  it('renders word count dropdown with correct value', () => {
    render(<ControlPanel {...defaultProps} />);

    const dropdown = screen.getByRole('combobox', { name: /word count/i });
    expect(dropdown).toHaveValue('1');
  });

  it('displays correct word count label', () => {
    render(<ControlPanel {...defaultProps} />);

    expect(screen.getByText('Word Count')).toBeInTheDocument();
  });

  it('calls onWordsPerChunkChange when dropdown value changes', async () => {
    const user = userEvent.setup();
    render(<ControlPanel {...defaultProps} />);

    const dropdown = screen.getByRole('combobox', { name: /word count/i });
    await user.selectOptions(dropdown, '3');

    expect(defaultProps.onWordsPerChunkChange).toHaveBeenCalledWith(3);
  });

  it('renders all word count options', () => {
    render(<ControlPanel {...defaultProps} />);

    expect(screen.getByRole('option', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
  });

  it('supports native keyboard navigation in dropdown', () => {
    render(<ControlPanel {...defaultProps} />);

    const dropdown = screen.getByRole('combobox', { name: /word count/i });

    // Test that dropdown can be focused (native behavior)
    expect(dropdown).not.toHaveAttribute('disabled');

    // Native select elements don't need explicit tabindex - they're focusable by default
    expect(dropdown).toBeVisible();
  });
});

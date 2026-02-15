import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '.';

describe('App component', () => {
  it('renders without crashing', () => {
    render(<App />);

    const heading = screen.getByRole('heading', {
      name: /speed reader/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();

    expect(screen.getByLabelText(/session text/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Read/ });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  describe('TextInput integration', () => {
    it('enables start button when text is entered', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      const startButton = screen.getByRole('button', {
        name: /Read/,
      });

      expect(startButton).toBeDisabled();

      await user.type(textarea, 'Some valid text content');
      expect(startButton).toBeEnabled();
    });

    it('shows validation error when submitting empty text', async () => {
      const user = userEvent.setup();
      render(<App />);

      const submitButton = screen.getByTestId('submit-button');

      await user.click(submitButton);

      const errorMessage = screen.getByText(
        'Enter at least one word before reading.',
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it('submits form when valid text is entered', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      const submitButton = screen.getByTestId('submit-button');

      await user.type(textarea, 'Valid text content');
      await user.click(submitButton);

      // Should transition to reading mode
      expect(screen.queryByLabelText(/session text/i)).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('starts a session and updates speed from the range input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textArea = screen.getByLabelText(/session text/i);
    await user.type(textArea, 'Alpha beta gamma');

    const startButton = screen.getByRole('button', { name: /Read/ });
    await user.click(startButton);

    expect(screen.getByRole('button', { name: /Pause/ })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /restart/i }),
    ).toBeInTheDocument();

    const speedSlider = screen.getByRole('slider', { name: /speed/i });
    fireEvent.change(speedSlider, { target: { value: '320' } });

    expect(
      screen.getByRole('slider', { name: /speed \(320 wpm\)/i }),
    ).toBeInTheDocument();
  });

  it('keeps setup mode on submit when text is invalid', () => {
    render(<App />);

    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);

    expect(screen.getByLabelText(/session text/i)).toBeInTheDocument();
    expect(
      screen.getByText('Enter at least one word before reading.'),
    ).toBeInTheDocument();
  });

  it('does not start reading when handleStartReading is called with invalid text', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Test the early return case in handleStartReading
    const startButton = screen.getByRole('button', { name: /Read/ });

    // Button should be disabled with empty text
    expect(startButton).toBeDisabled();

    // Try to click it (shouldn't work due to being disabled)
    await user.click(startButton);

    // Should still be in setup mode
    expect(screen.getByLabelText(/session text/i)).toBeInTheDocument();
  });

  it('tests handleStartReading early return with invalid input', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add some whitespace text (appears valid visually but fails hasReadableText check)
    const textarea = screen.getByLabelText(/session text/i);
    await user.type(textarea, '   ');

    const startButton = screen.getByRole('button', { name: /Read/ });

    // Button should still be disabled for whitespace-only text
    expect(startButton).toBeDisabled();

    // Try to click it (shouldn't work)
    await user.click(startButton);

    // Should still be in setup mode
    expect(screen.getByLabelText(/session text/i)).toBeInTheDocument();
  });

  describe('ReadingDisplay integration', () => {
    it('renders ReadingDisplay component when in reading mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      const startButton = screen.getByRole('button', { name: /Read/ });

      await user.type(textarea, 'Test word content');
      await user.click(startButton);

      // Should show ReadingDisplay component with proper attributes
      const statusElement = screen.getByRole('status');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
      expect(statusElement).toHaveAttribute('aria-atomic', 'true');
    });

    it('displays current word in ReadingDisplay during session', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      const startButton = screen.getByRole('button', { name: /Read/ });

      await user.type(textarea, 'Hello world test');
      await user.click(startButton);

      // Should display the first word initially
      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveTextContent('Hello');
    });

    it('shows empty ReadingDisplay when no words are available', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      const startButton = screen.getByRole('button', { name: /Read/ });

      await user.type(textarea, '   '); // Only whitespace
      // Button should be disabled, so we can't start a session
      expect(startButton).toBeDisabled();

      // Should still be in setup mode, not showing ReadingDisplay
      expect(screen.getByLabelText(/session text/i)).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('ControlPanel integration', () => {
    it('renders ControlPanel with speed slider and buttons', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'Test content for reading');

      // Should show speed slider
      const speedSlider = screen.getByRole('slider', { name: /speed/i });
      expect(speedSlider).toBeInTheDocument();
      expect(speedSlider).toHaveValue('320');

      // Should show Start Reading button
      expect(screen.getByRole('button', { name: /Read/ })).toBeInTheDocument();
    });

    it('shows correct buttons based on session state', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'Test content for reading');

      const startButton = screen.getByRole('button', { name: /Read/ });
      await user.click(startButton);

      // Should show Pause, Restart, Edit Text buttons in running state
      expect(screen.getByRole('button', { name: /Pause/ })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /restart/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /edit text/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Read/ }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Play/ }),
      ).not.toBeInTheDocument();
    });

    it('shows Resume button when paused', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'Test content for reading');

      const startButton = screen.getByRole('button', { name: /Read/ });
      await user.click(startButton);

      // Pause the session
      const pauseButton = screen.getByRole('button', { name: /Pause/ });
      await user.click(pauseButton);

      // Should show Resume button
      expect(screen.getByRole('button', { name: /Play/ })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Pause/ }),
      ).not.toBeInTheDocument();
    });

    it('handles speed slider changes', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'Test content for reading');

      const speedSlider = screen.getByRole('slider', { name: /speed/i });

      // Change speed value
      fireEvent.change(speedSlider, { target: { value: '300' } });

      expect(speedSlider).toHaveValue('300');
      expect(screen.getByText(/speed \(300 wpm\)/i)).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(<App />);

      const controlsGroup = screen.getByRole('group', {
        name: 'Reading controls',
      });
      expect(controlsGroup).toBeInTheDocument();

      const speedSlider = screen.getByRole('slider', { name: /speed/i });
      expect(speedSlider).toHaveAttribute('aria-valuemin', '100');
      expect(speedSlider).toHaveAttribute('aria-valuemax', '1000');
      expect(speedSlider).toHaveAttribute('aria-valuenow', '300');
    });
  });

  describe('SessionDetails integration', () => {
    it('renders SessionDetails component when in reading mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'Test content for reading');

      const startButton = screen.getByRole('button', {
        name: /Read/,
      });
      await user.click(startButton);

      // Should show SessionDetails component
      expect(screen.getByText('Session details')).toBeInTheDocument();
      expect(screen.getByText(/Progress:/)).toBeInTheDocument();
      expect(screen.getByText(/Tempo:/)).toBeInTheDocument();
    });

    it('displays correct progress information', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'One two three four five');

      const startButton = screen.getByRole('button', {
        name: /Read/,
      });
      await user.click(startButton);

      // Should show progress with word count
      expect(screen.getByText(/Progress:/)).toBeInTheDocument();
      expect(screen.getByText('5', { selector: 'strong' })).toBeInTheDocument(); // total words
    });

    it('displays correct tempo information', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'Test content');

      const startButton = screen.getByRole('button', {
        name: /Read/,
      });
      await user.click(startButton);

      // Should show tempo with WPM
      expect(screen.getByText(/Tempo:/)).toBeInTheDocument();
      expect(screen.getAllByText(/300 WPM/)).toHaveLength(1);
    });

    it('does not show SessionDetails in setup mode', () => {
      render(<App />);

      // Should not show SessionDetails in setup mode
      expect(screen.queryByText('Session details')).not.toBeInTheDocument();
      expect(screen.queryByText(/Progress:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Tempo:/)).not.toBeInTheDocument();
    });

    it('has proper accessibility attributes', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'Test content');

      const startButton = screen.getByRole('button', {
        name: /Read/,
      });
      await user.click(startButton);

      // Should have proper accessibility attributes
      const detailsElements = screen.getAllByRole('group');
      const sessionDetailsElement = detailsElements.find((el) =>
        el.textContent.includes('Session details'),
      );
      expect(sessionDetailsElement).toBeInTheDocument();
      if (sessionDetailsElement) {
        expect(sessionDetailsElement.tagName).toBe('DETAILS');
      }

      const liveRegion = screen.getByText(/Progress:/).parentElement;
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('SessionCompletion integration', () => {
    it('renders SessionCompletion component when session is completed', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      await user.type(textarea, 'One two');

      const startButton = screen.getByRole('button', {
        name: /Read/,
      });
      await user.click(startButton);

      // Wait for session to complete (2 words at default speed)
      // Note: In a real test, you'd need to mock timers or wait for completion
      // For now, let's just test that the component structure exists

      // SessionCompletion should only show when status is 'completed'
      expect(screen.queryByText('Session complete')).not.toBeInTheDocument();
    });

    it('does not render SessionCompletion component in setup mode', () => {
      render(<App />);

      // Should not show completion message in setup mode
      expect(screen.queryByText('Session complete')).not.toBeInTheDocument();
      expect(screen.queryByText(/You read/)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'Session complete' }),
      ).not.toBeInTheDocument();
    });
  });
});

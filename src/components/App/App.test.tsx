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

    const button = screen.getByRole('button', { name: /start reading/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  describe('TextInput integration', () => {
    it('enables start button when text is entered', async () => {
      const user = userEvent.setup();
      render(<App />);

      const textarea = screen.getByLabelText(/session text/i);
      const startButton = screen.getByRole('button', {
        name: /start reading/i,
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
        /enter at least one word before starting/i,
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

  it('enables start button after entering readable text', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textArea = screen.getByLabelText(/session text/i);
    const button = screen.getByRole('button', { name: /start reading/i });

    expect(button).toBeDisabled();

    await user.type(textArea, 'Hello world');

    expect(button).toBeEnabled();

    await user.clear(textArea);

    expect(button).toBeDisabled();
  });

  it('starts a session and updates speed from the range input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textArea = screen.getByLabelText(/session text/i);
    await user.type(textArea, 'Alpha beta gamma');

    const startButton = screen.getByRole('button', { name: /start reading/i });
    await user.click(startButton);

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
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
      screen.getByText(/enter at least one word before starting/i),
    ).toBeInTheDocument();
  });

  it('does not start reading when handleStartReading is called with invalid text', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Test the early return case in handleStartReading
    const startButton = screen.getByRole('button', { name: /start reading/i });

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

    const startButton = screen.getByRole('button', { name: /start reading/i });

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
      const startButton = screen.getByRole('button', {
        name: /start reading/i,
      });

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
      const startButton = screen.getByRole('button', {
        name: /start reading/i,
      });

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
      const startButton = screen.getByRole('button', {
        name: /start reading/i,
      });

      await user.type(textarea, '   '); // Only whitespace
      // Button should be disabled, so we can't start a session
      expect(startButton).toBeDisabled();

      // Should still be in setup mode, not showing ReadingDisplay
      expect(screen.getByLabelText(/session text/i)).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});

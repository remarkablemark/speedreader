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
});

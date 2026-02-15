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

    const startButton = screen.getByRole('button', { name: /start reading/i });
    const form = startButton.closest('form');

    expect(form).not.toBeNull();
    if (form === null) {
      return;
    }

    fireEvent.submit(form);

    expect(screen.getByLabelText(/session text/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start reading/i }),
    ).toBeDisabled();
  });
});

import { render, screen } from '@testing-library/react';
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
});

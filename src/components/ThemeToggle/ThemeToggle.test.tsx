import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('should render with light theme icon', () => {
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="light" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button', {
      name: /toggle dark mode, currently light mode/i,
    });

    expect(button).toBeInTheDocument();
  });

  it('should render with dark theme icon', () => {
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="dark" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button', {
      name: /toggle dark mode, currently dark mode/i,
    });

    expect(button).toBeInTheDocument();
  });

  it('should render with system theme state', () => {
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="system" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button', {
      name: /toggle dark mode, currently system mode/i,
    });

    expect(button).toBeInTheDocument();
  });

  it('should call onThemeToggle when clicked', async () => {
    const user = userEvent.setup();
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="light" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button');

    await user.click(button);

    expect(onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onThemeToggle when activated with Enter key', async () => {
    const user = userEvent.setup();
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="light" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button');

    button.focus();
    await user.keyboard('{Enter}');

    expect(onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onThemeToggle when activated with Space key', async () => {
    const user = userEvent.setup();
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="light" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button');

    button.focus();
    await user.keyboard(' ');

    expect(onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it('should not call onThemeToggle when disabled', async () => {
    const user = userEvent.setup();
    const onThemeToggle = vi.fn();

    render(
      <ThemeToggle
        currentTheme="light"
        onThemeToggle={onThemeToggle}
        disabled
      />,
    );

    const button = screen.getByRole('button');

    await user.click(button);

    expect(onThemeToggle).not.toHaveBeenCalled();
  });

  it('should be focusable via keyboard', () => {
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="light" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button');

    button.focus();

    expect(button).toHaveFocus();
  });

  it('should have proper ARIA label for accessibility', () => {
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="light" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button', {
      name: /toggle dark mode, currently light mode/i,
    });

    expect(button).toHaveAttribute('aria-label');
  });

  it('should have type="button" to prevent form submission', () => {
    const onThemeToggle = vi.fn();

    render(<ThemeToggle currentTheme="light" onThemeToggle={onThemeToggle} />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
  });
});

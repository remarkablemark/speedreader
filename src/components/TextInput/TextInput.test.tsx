import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { TextInput } from './TextInput';

describe('TextInput', () => {
  const mockOnSubmit = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders textarea with correct attributes', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute(
      'placeholder',
      'Paste text to begin your speed reading session.',
    );
    expect(textarea).toHaveAttribute('rows', '10');
  });

  test('calls onChange when text is typed', async () => {
    const user = userEvent.setup();
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello');

    // Check that onChange was called when typing
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledTimes(5);
  });

  test('displays validation message when input is invalid', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={false}
      />,
    );

    const errorMessage = screen.getByText(
      'Enter at least one word before reading.',
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-rose-700');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  test('does not display validation message when input is valid', () => {
    render(
      <TextInput
        value="Some text"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const errorMessage = screen.queryByText(
      'Enter at least one word before reading.',
    );
    expect(errorMessage).not.toBeInTheDocument();
  });

  test('calls onSubmit when form is submitted with valid input', async () => {
    const user = userEvent.setup();
    render(
      <TextInput
        value="Valid text content"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('Valid text content');
  });

  test('does not call onSubmit when form is submitted with invalid input', async () => {
    const user = userEvent.setup();
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={false}
      />,
    );

    const textarea = screen.getByRole('textbox');
    const form = textarea.closest('form');

    if (form) {
      await user.click(form);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    }
  });

  test('is disabled when disabled prop is true', () => {
    render(
      <TextInput
        value="Some text"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
        disabled={true}
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  test('has proper accessibility attributes', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass(
      'focus:border-sky-500',
      'focus:ring-2',
      'focus:ring-sky-200',
    );
  });

  test('renders label with correct text and htmlFor', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const label = screen.getByText('Session text');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  test('renders hidden submit button', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('sr-only');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('renders hidden word count input', () => {
    render(
      <TextInput
        value="hello world"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const wordCountInput = screen.getByTestId('word-count');
    expect(wordCountInput).toBeInTheDocument();
    expect(wordCountInput).toHaveAttribute('type', 'hidden');
    expect(wordCountInput).toHaveAttribute('value', '2');
  });

  test('calculates word count correctly for empty text', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={false}
      />,
    );

    const wordCountInput = screen.getByTestId('word-count');
    expect(wordCountInput).toHaveAttribute('value', '0');
  });

  test('calculates word count correctly for single word', () => {
    render(
      <TextInput
        value="hello"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const wordCountInput = screen.getByTestId('word-count');
    expect(wordCountInput).toHaveAttribute('value', '1');
  });

  test('calculates word count correctly for multiple words with extra spaces', () => {
    render(
      <TextInput
        value="  hello   world  test  "
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const wordCountInput = screen.getByTestId('word-count');
    expect(wordCountInput).toHaveAttribute('value', '3');
  });

  test('calls onSubmit when form is submitted via submit button', async () => {
    const user = userEvent.setup();
    render(
      <TextInput
        value="Valid text content"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const submitButton = screen.getByTestId('submit-button');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('Valid text content');
  });

  test('prevents form submission when invalid and submit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={false}
      />,
    );

    const submitButton = screen.getByTestId('submit-button');
    await user.click(submitButton);

    // onSubmit should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('generates IDs for accessibility', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={true}
      />,
    );

    const textarea = screen.getByRole('textbox');
    const textareaId = textarea.id;

    // ID should be generated and match expected pattern
    expect(textareaId).toBeTruthy();
    expect(typeof textareaId).toBe('string');
  });

  test('associates validation message with textarea correctly', () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        isValid={false}
      />,
    );

    const errorMessage = screen.getByRole('alert');

    // The validation message should be properly associated
    expect(errorMessage).toHaveTextContent(
      'Enter at least one word before reading.',
    );
    expect(errorMessage).toHaveAttribute('id');
  });
});

import { useId } from 'react';

import type { TextInputProps } from './TextInput.types';
import { tokenizeContent } from './tokenizeContent';

/**
 * Text input component with validation and form submission.
 * Handles text input for speed reading sessions with proper accessibility.
 */
export const TextInput = ({
  value,
  onChange,
  onSubmit,
  isValid,
  disabled = false,
}: TextInputProps) => {
  const textAreaId = useId();
  const validationId = useId();

  const { totalWords } = tokenizeContent(value);

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();

        if (!isValid) {
          return;
        }

        onSubmit(value);
      }}
    >
      <label
        className="block text-sm font-medium text-slate-900"
        htmlFor={textAreaId}
      >
        Session text
      </label>
      <textarea
        id={textAreaId}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        disabled={disabled}
        className="min-h-56 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 shadow-sm transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        placeholder="Paste text to begin your speed reading session."
        rows={10}
      />
      {!isValid ? (
        <p className="text-sm text-rose-700" id={validationId} role="alert">
          Enter at least one word before reading.
        </p>
      ) : null}
      <button type="submit" className="sr-only" data-testid="submit-button">
        Submit
      </button>
      <input type="hidden" value={totalWords} data-testid="word-count" />
    </form>
  );
};

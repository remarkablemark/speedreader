export interface TextInputProps {
  /**
   * Current text value
   */
  value: string;

  /**
   * Change handler for text input
   */
  onChange: (value: string) => void;

  /**
   * Submit handler for form submission
   */
  onSubmit: (text: string) => void;

  /**
   * Whether the current input is valid
   */
  isValid: boolean;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
}

import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  /**
   * Visual style variant for the button
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary';

  /**
   * Whether the button is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Click handler function
   */
  onClick?: () => void;

  /**
   * Button type attribute
   * @defaultValue 'button'
   */
  type?: 'button' | 'submit';

  /**
   * Additional CSS classes
   */
  className?: string;
}

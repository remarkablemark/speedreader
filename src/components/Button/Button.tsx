import type { ButtonProps } from './Button.types';

/**
 * Reusable Button component with primary and secondary variants.
 * Provides consistent styling and accessibility across the application.
 */
export const Button = ({
  variant = 'primary',
  children,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const baseClasses =
    'inline-flex shrink-0 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses: Record<'primary' | 'secondary', string> = {
    primary:
      'border-sky-600 bg-sky-600 text-white hover:border-sky-700 hover:bg-sky-700 dark:border-sky-500 dark:bg-sky-500 dark:hover:border-sky-600 dark:hover:bg-sky-600',
    secondary:
      'border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

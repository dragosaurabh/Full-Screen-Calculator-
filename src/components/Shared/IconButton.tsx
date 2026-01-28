/**
 * Accessible Icon Button Component
 * 
 * A reusable icon button with consistent styling and accessibility features.
 * Validates: Requirements 18.1
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for the button (required for icon-only buttons) */
  'aria-label': string;
  /** Icon to display */
  icon: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
  primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
};

const sizeStyles = {
  sm: 'p-1.5 min-h-[32px] min-w-[32px]',
  md: 'p-2 min-h-[44px] min-w-[44px]',
  lg: 'p-3 min-h-[52px] min-w-[52px]',
};

const iconSizeStyles = {
  sm: '[&>svg]:h-4 [&>svg]:w-4',
  md: '[&>svg]:h-5 [&>svg]:w-5',
  lg: '[&>svg]:h-6 [&>svg]:w-6',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      'aria-label': ariaLabel,
      icon,
      variant = 'default',
      size = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center rounded-lg
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${iconSizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

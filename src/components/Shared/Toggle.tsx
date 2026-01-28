/**
 * Accessible Toggle Switch Component
 * 
 * A fully accessible toggle switch with proper ARIA attributes and keyboard support.
 * Validates: Requirements 18.1
 */

import { useId, type KeyboardEvent } from 'react';

export interface ToggleProps {
  /** Whether the toggle is checked */
  checked: boolean;
  /** Callback when the toggle state changes */
  onChange: (checked: boolean) => void;
  /** Label text for the toggle */
  label: string;
  /** Whether the label should be visually hidden (still accessible to screen readers) */
  labelHidden?: boolean;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class name for the container */
  className?: string;
}

const sizeStyles = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
};

export function Toggle({
  checked,
  onChange,
  label,
  labelHidden = false,
  disabled = false,
  size = 'md',
  className = '',
}: ToggleProps) {
  const id = useId();
  const styles = sizeStyles[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${styles.track}
          ${checked ? 'bg-blue-500' : 'bg-gray-300'}
        `}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block transform rounded-full
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${styles.thumb}
            ${checked ? styles.translate : 'translate-x-0.5'}
          `}
        />
      </button>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className={`
          text-sm font-medium text-gray-700 cursor-pointer
          ${labelHidden ? 'sr-only' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {label}
      </label>
    </div>
  );
}

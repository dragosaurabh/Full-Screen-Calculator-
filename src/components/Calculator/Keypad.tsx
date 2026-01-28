/**
 * Keypad Component
 * 
 * Renders mode-specific calculator buttons.
 * Adapts layout based on viewport size.
 * Ensures minimum 44px touch targets on mobile.
 * Validates: Requirements 16.4, 18.2
 */

import React from 'react';
import type { CalculatorMode, KeypadInput, KeypadAction } from '../../types';

interface KeypadProps {
  mode: CalculatorMode;
  onInput: (input: KeypadInput) => void;
  onAction: (action: KeypadAction) => void;
  disabled: boolean;
}

interface ButtonConfig {
  label: string;
  value: string;
  type: 'digit' | 'operator' | 'function' | 'constant' | 'parenthesis' | 'action';
  action?: KeypadAction['type'];
  className?: string;
  ariaLabel?: string;
  span?: number;
}

// Basic mode buttons
const basicButtons: ButtonConfig[][] = [
  [
    { label: 'C', value: 'clear', type: 'action', action: 'clear', className: 'bg-red-100 text-red-600 hover:bg-red-200' },
    { label: '(', value: '(', type: 'parenthesis' },
    { label: ')', value: ')', type: 'parenthesis' },
    { label: '÷', value: '/', type: 'operator', ariaLabel: 'divide' },
  ],
  [
    { label: '7', value: '7', type: 'digit' },
    { label: '8', value: '8', type: 'digit' },
    { label: '9', value: '9', type: 'digit' },
    { label: '×', value: '*', type: 'operator', ariaLabel: 'multiply' },
  ],
  [
    { label: '4', value: '4', type: 'digit' },
    { label: '5', value: '5', type: 'digit' },
    { label: '6', value: '6', type: 'digit' },
    { label: '−', value: '-', type: 'operator', ariaLabel: 'subtract' },
  ],
  [
    { label: '1', value: '1', type: 'digit' },
    { label: '2', value: '2', type: 'digit' },
    { label: '3', value: '3', type: 'digit' },
    { label: '+', value: '+', type: 'operator', ariaLabel: 'add' },
  ],
  [
    { label: '0', value: '0', type: 'digit' },
    { label: '.', value: '.', type: 'digit', ariaLabel: 'decimal point' },
    { label: '⌫', value: 'backspace', type: 'action', action: 'backspace', ariaLabel: 'backspace' },
    { label: '=', value: 'evaluate', type: 'action', action: 'evaluate', className: 'bg-blue-500 text-white hover:bg-blue-600' },
  ],
];

// Scientific mode buttons
const scientificButtons: ButtonConfig[][] = [
  [
    { label: 'sin', value: 'sin', type: 'function' },
    { label: 'cos', value: 'cos', type: 'function' },
    { label: 'tan', value: 'tan', type: 'function' },
    { label: 'π', value: 'pi', type: 'constant', ariaLabel: 'pi' },
  ],
  [
    { label: 'ln', value: 'ln', type: 'function', ariaLabel: 'natural log' },
    { label: 'log', value: 'log', type: 'function', ariaLabel: 'log base 10' },
    { label: 'e', value: 'e', type: 'constant', ariaLabel: 'euler number' },
    { label: '^', value: '^', type: 'operator', ariaLabel: 'power' },
  ],
  [
    { label: '√', value: 'sqrt', type: 'function', ariaLabel: 'square root' },
    { label: 'x²', value: '^2', type: 'operator', ariaLabel: 'square' },
    { label: '!', value: 'factorial', type: 'function', ariaLabel: 'factorial' },
    { label: '%', value: '%', type: 'operator', ariaLabel: 'modulo' },
  ],
];

// Programmer mode buttons
const programmerButtons: ButtonConfig[][] = [
  [
    { label: 'HEX', value: 'hex', type: 'function', className: 'bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm' },
    { label: 'DEC', value: 'dec', type: 'function', className: 'bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm' },
    { label: 'OCT', value: 'oct', type: 'function', className: 'bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm' },
    { label: 'BIN', value: 'bin', type: 'function', className: 'bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm' },
  ],
  [
    { label: 'AND', value: 'and', type: 'operator', className: 'bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm' },
    { label: 'OR', value: 'or', type: 'operator', className: 'bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm' },
    { label: 'XOR', value: 'xor', type: 'operator', className: 'bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm' },
    { label: 'NOT', value: 'not', type: 'function', className: 'bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm' },
  ],
  [
    { label: '<<', value: 'lshift', type: 'operator', ariaLabel: 'left shift' },
    { label: '>>', value: 'rshift', type: 'operator', ariaLabel: 'right shift' },
    { label: 'A', value: 'A', type: 'digit' },
    { label: 'B', value: 'B', type: 'digit' },
  ],
  [
    { label: 'C', value: 'C', type: 'digit' },
    { label: 'D', value: 'D', type: 'digit' },
    { label: 'E', value: 'E', type: 'digit' },
    { label: 'F', value: 'F', type: 'digit' },
  ],
];

// Statistics mode buttons
const statisticsButtons: ButtonConfig[][] = [
  [
    { label: 'mean', value: 'mean', type: 'function', className: 'bg-green-100 text-green-700 hover:bg-green-200 text-sm' },
    { label: 'median', value: 'median', type: 'function', className: 'bg-green-100 text-green-700 hover:bg-green-200 text-sm' },
    { label: 'mode', value: 'mode', type: 'function', className: 'bg-green-100 text-green-700 hover:bg-green-200 text-sm' },
    { label: 'σ', value: 'stdev', type: 'function', ariaLabel: 'standard deviation', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  ],
  [
    { label: 'var', value: 'variance', type: 'function', className: 'bg-green-100 text-green-700 hover:bg-green-200 text-sm' },
    { label: 'sum', value: 'sum', type: 'function', className: 'bg-green-100 text-green-700 hover:bg-green-200 text-sm' },
    { label: 'min', value: 'min', type: 'function', className: 'bg-green-100 text-green-700 hover:bg-green-200 text-sm' },
    { label: 'max', value: 'max', type: 'function', className: 'bg-green-100 text-green-700 hover:bg-green-200 text-sm' },
  ],
  [
    { label: 'nPr', value: 'permutation', type: 'function', ariaLabel: 'permutation' },
    { label: 'nCr', value: 'combination', type: 'function', ariaLabel: 'combination' },
    { label: 'n!', value: 'factorial', type: 'function', ariaLabel: 'factorial' },
    { label: ',', value: ',', type: 'operator', ariaLabel: 'comma separator' },
  ],
];

// Complex mode buttons
const complexButtons: ButtonConfig[][] = [
  [
    { label: 'i', value: 'i', type: 'constant', ariaLabel: 'imaginary unit', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' },
    { label: 'Re', value: 'real', type: 'function', ariaLabel: 'real part', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-sm' },
    { label: 'Im', value: 'imag', type: 'function', ariaLabel: 'imaginary part', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-sm' },
    { label: '|z|', value: 'abs', type: 'function', ariaLabel: 'magnitude', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' },
  ],
  [
    { label: 'conj', value: 'conj', type: 'function', ariaLabel: 'conjugate', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-sm' },
    { label: 'arg', value: 'arg', type: 'function', ariaLabel: 'argument/phase', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-sm' },
    { label: '→pol', value: 'topolar', type: 'function', ariaLabel: 'to polar', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-sm' },
    { label: '→rec', value: 'torect', type: 'function', ariaLabel: 'to rectangular', className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-sm' },
  ],
];

// Financial mode buttons  
const financialButtons: ButtonConfig[][] = [
  [
    { label: 'PV', value: 'pv', type: 'function', ariaLabel: 'present value', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
    { label: 'FV', value: 'fv', type: 'function', ariaLabel: 'future value', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
    { label: 'PMT', value: 'pmt', type: 'function', ariaLabel: 'payment', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm' },
    { label: 'N', value: 'nper', type: 'function', ariaLabel: 'number of periods', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  ],
  [
    { label: 'I/Y', value: 'rate', type: 'function', ariaLabel: 'interest rate', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm' },
    { label: 'NPV', value: 'npv', type: 'function', ariaLabel: 'net present value', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm' },
    { label: 'IRR', value: 'irr', type: 'function', ariaLabel: 'internal rate of return', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm' },
    { label: '%', value: '%', type: 'operator', ariaLabel: 'percent' },
  ],
];

// Matrix mode buttons
const matrixButtons: ButtonConfig[][] = [
  [
    { label: '[', value: '[', type: 'parenthesis', ariaLabel: 'matrix start' },
    { label: ']', value: ']', type: 'parenthesis', ariaLabel: 'matrix end' },
    { label: ';', value: ';', type: 'operator', ariaLabel: 'row separator' },
    { label: ',', value: ',', type: 'operator', ariaLabel: 'column separator' },
  ],
  [
    { label: 'det', value: 'det', type: 'function', ariaLabel: 'determinant', className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm' },
    { label: 'inv', value: 'inv', type: 'function', ariaLabel: 'inverse', className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm' },
    { label: 'trans', value: 'transpose', type: 'function', ariaLabel: 'transpose', className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm' },
    { label: '×', value: '*', type: 'operator', ariaLabel: 'matrix multiply' },
  ],
];

// Converter mode buttons
const converterButtons: ButtonConfig[][] = [
  [
    { label: 'Length', value: 'length', type: 'function', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm' },
    { label: 'Mass', value: 'mass', type: 'function', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm' },
    { label: 'Temp', value: 'temp', type: 'function', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm' },
    { label: 'Time', value: 'time', type: 'function', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm' },
  ],
  [
    { label: 'Data', value: 'data', type: 'function', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm' },
    { label: 'Area', value: 'area', type: 'function', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm' },
    { label: 'Vol', value: 'volume', type: 'function', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm' },
    { label: '→', value: 'convert', type: 'operator', ariaLabel: 'convert to', className: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
  ],
];

// Get mode-specific buttons
function getModeButtons(mode: CalculatorMode): ButtonConfig[][] {
  switch (mode) {
    case 'scientific':
      return scientificButtons;
    case 'programmer':
      return programmerButtons;
    case 'statistics':
      return statisticsButtons;
    case 'complex':
      return complexButtons;
    case 'financial':
      return financialButtons;
    case 'matrix':
      return matrixButtons;
    case 'converter':
      return converterButtons;
    default:
      return [];
  }
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  onInput,
  onAction,
  disabled
}) => {
  const handleClick = (button: ButtonConfig) => {
    if (disabled) return;
    
    if (button.type === 'action' && button.action) {
      onAction({ type: button.action });
    } else if (button.type === 'digit') {
      onInput({ type: 'digit', value: button.value });
    } else if (button.type === 'operator') {
      onInput({ type: 'operator', value: button.value });
    } else if (button.type === 'function') {
      onInput({ type: 'function', value: button.value });
    } else if (button.type === 'constant') {
      onInput({ type: 'constant', value: button.value });
    } else if (button.type === 'parenthesis') {
      onInput({ type: 'parenthesis', value: button.value as '(' | ')' });
    }
  };

  const renderButton = (button: ButtonConfig, index: number) => (
    <button
      key={index}
      onClick={() => handleClick(button)}
      disabled={disabled}
      className={`
        min-h-[44px] min-w-[44px] p-3 rounded-lg font-semibold text-lg
        transition-colors duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${button.className || 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}
      `}
      aria-label={button.ariaLabel || button.label}
      role="button"
    >
      {button.label}
    </button>
  );

  const renderButtonRow = (row: ButtonConfig[], rowIndex: number) => (
    <div key={rowIndex} className="grid grid-cols-4 gap-2">
      {row.map((button, index) => renderButton(button, index))}
    </div>
  );

  const modeButtons = getModeButtons(mode);

  return (
    <div 
      className="keypad space-y-2"
      role="group"
      aria-label="Calculator keypad"
    >
      {/* Mode-specific buttons */}
      {modeButtons.length > 0 && (
        <div className="mode-buttons space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {modeButtons.map(renderButtonRow)}
        </div>
      )}
      
      {/* Basic buttons (always shown) */}
      <div className="basic-buttons space-y-2">
        {basicButtons.map(renderButtonRow)}
      </div>
    </div>
  );
};

export default Keypad;

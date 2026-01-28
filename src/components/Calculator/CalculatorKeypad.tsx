/**
 * CalculatorKeypad - LOCKED STRUCTURE
 * 
 * PRIMARY INTERACTION - Never hidden, always visible.
 * 
 * Rules:
 * - Large, touch-friendly buttons
 * - Same visual weight as display
 * - Mode-specific functions adapt, basic keypad stays
 */

import React from 'react';
import type { CalculatorMode, KeypadInput, KeypadAction } from '../../types';

interface CalculatorKeypadProps {
  mode: CalculatorMode;
  onInput: (input: KeypadInput) => void;
  onAction: (action: KeypadAction) => void;
  disabled: boolean;
  isFullscreen?: boolean;
}

interface ButtonConfig {
  label: string;
  value: string;
  type: 'digit' | 'operator' | 'function' | 'constant' | 'parenthesis' | 'action';
  action?: KeypadAction['type'];
  variant?: 'default' | 'primary' | 'danger' | 'accent' | 'secondary';
  span?: number;
}

const CalcButton: React.FC<{
  config: ButtonConfig;
  onClick: () => void;
  disabled: boolean;
  isFullscreen?: boolean;
}> = ({ config, onClick, disabled, isFullscreen = false }) => {
  const variants = {
    default: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm',
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30',
    danger: 'bg-red-500 hover:bg-red-400 text-white',
    accent: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`keypad-button rounded-xl font-semibold flex items-center justify-center
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all
                 ${variants[config.variant || 'default']}
                 ${config.span === 2 ? 'col-span-2' : ''}
                 ${isFullscreen 
                   ? 'text-2xl lg:text-3xl xl:text-4xl px-4 py-3 h-full min-h-[60px]' 
                   : 'min-h-[56px] text-xl px-3 py-3'}
                 ${config.variant === 'secondary' ? (isFullscreen ? 'text-lg lg:text-xl' : 'text-sm') : ''}`}
      aria-label={config.label}
      style={isFullscreen ? { height: '100%' } : undefined}
    >
      {config.label}
    </button>
  );
};

// Basic keypad - ALWAYS SHOWN
const basicLayout: ButtonConfig[][] = [
  [
    { label: 'C', value: 'clear', type: 'action', action: 'clear', variant: 'danger' },
    { label: '(', value: '(', type: 'parenthesis', variant: 'accent' },
    { label: ')', value: ')', type: 'parenthesis', variant: 'accent' },
    { label: '÷', value: '/', type: 'operator', variant: 'accent' },
  ],
  [
    { label: '7', value: '7', type: 'digit' },
    { label: '8', value: '8', type: 'digit' },
    { label: '9', value: '9', type: 'digit' },
    { label: '×', value: '*', type: 'operator', variant: 'accent' },
  ],
  [
    { label: '4', value: '4', type: 'digit' },
    { label: '5', value: '5', type: 'digit' },
    { label: '6', value: '6', type: 'digit' },
    { label: '−', value: '-', type: 'operator', variant: 'accent' },
  ],
  [
    { label: '1', value: '1', type: 'digit' },
    { label: '2', value: '2', type: 'digit' },
    { label: '3', value: '3', type: 'digit' },
    { label: '+', value: '+', type: 'operator', variant: 'accent' },
  ],
  [
    { label: '0', value: '0', type: 'digit', span: 2 },
    { label: '.', value: '.', type: 'digit' },
    { label: '=', value: 'evaluate', type: 'action', action: 'evaluate', variant: 'primary' },
  ],
];

// Mode-specific functions
const modeFunctions: Record<CalculatorMode, ButtonConfig[]> = {
  basic: [],
  scientific: [
    { label: 'sin', value: 'sin', type: 'function', variant: 'secondary' },
    { label: 'cos', value: 'cos', type: 'function', variant: 'secondary' },
    { label: 'tan', value: 'tan', type: 'function', variant: 'secondary' },
    { label: 'π', value: 'pi', type: 'constant', variant: 'secondary' },
    { label: 'ln', value: 'ln', type: 'function', variant: 'secondary' },
    { label: 'log', value: 'log', type: 'function', variant: 'secondary' },
    { label: 'e', value: 'e', type: 'constant', variant: 'secondary' },
    { label: '^', value: '^', type: 'operator', variant: 'secondary' },
    { label: '√', value: 'sqrt', type: 'function', variant: 'secondary' },
    { label: 'x²', value: '^2', type: 'operator', variant: 'secondary' },
    { label: '!', value: 'factorial', type: 'function', variant: 'secondary' },
    { label: '%', value: '%', type: 'operator', variant: 'secondary' },
  ],
  programmer: [
    { label: 'HEX', value: 'hex', type: 'function', variant: 'secondary' },
    { label: 'DEC', value: 'dec', type: 'function', variant: 'secondary' },
    { label: 'BIN', value: 'bin', type: 'function', variant: 'secondary' },
    { label: 'OCT', value: 'oct', type: 'function', variant: 'secondary' },
    { label: 'AND', value: '&', type: 'operator', variant: 'secondary' },
    { label: 'OR', value: '|', type: 'operator', variant: 'secondary' },
    { label: 'XOR', value: '^', type: 'operator', variant: 'secondary' },
    { label: 'NOT', value: '~', type: 'function', variant: 'secondary' },
    { label: 'A', value: 'A', type: 'digit', variant: 'secondary' },
    { label: 'B', value: 'B', type: 'digit', variant: 'secondary' },
    { label: 'C', value: 'C', type: 'digit', variant: 'secondary' },
    { label: 'D', value: 'D', type: 'digit', variant: 'secondary' },
    { label: 'E', value: 'E', type: 'digit', variant: 'secondary' },
    { label: 'F', value: 'F', type: 'digit', variant: 'secondary' },
    { label: '<<', value: '<<', type: 'operator', variant: 'secondary' },
    { label: '>>', value: '>>', type: 'operator', variant: 'secondary' },
  ],
  graphing: [],
  statistics: [
    { label: 'mean', value: 'mean', type: 'function', variant: 'secondary' },
    { label: 'median', value: 'median', type: 'function', variant: 'secondary' },
    { label: 'mode', value: 'mode', type: 'function', variant: 'secondary' },
    { label: 'σ', value: 'stdev', type: 'function', variant: 'secondary' },
    { label: 'var', value: 'variance', type: 'function', variant: 'secondary' },
    { label: 'sum', value: 'sum', type: 'function', variant: 'secondary' },
    { label: 'min', value: 'min', type: 'function', variant: 'secondary' },
    { label: 'max', value: 'max', type: 'function', variant: 'secondary' },
    { label: 'nPr', value: 'permutation', type: 'function', variant: 'secondary' },
    { label: 'nCr', value: 'combination', type: 'function', variant: 'secondary' },
    { label: 'n!', value: 'factorial', type: 'function', variant: 'secondary' },
    { label: ',', value: ',', type: 'operator', variant: 'secondary' },
  ],
  financial: [
    { label: 'PV', value: 'pv', type: 'function', variant: 'secondary' },
    { label: 'FV', value: 'fv', type: 'function', variant: 'secondary' },
    { label: 'PMT', value: 'pmt', type: 'function', variant: 'secondary' },
    { label: 'N', value: 'nper', type: 'function', variant: 'secondary' },
    { label: 'I/Y', value: 'rate', type: 'function', variant: 'secondary' },
    { label: 'NPV', value: 'npv', type: 'function', variant: 'secondary' },
    { label: 'IRR', value: 'irr', type: 'function', variant: 'secondary' },
    { label: '%', value: '%', type: 'operator', variant: 'secondary' },
  ],
  complex: [
    { label: 'i', value: 'i', type: 'constant', variant: 'secondary' },
    { label: 'Re', value: 'real', type: 'function', variant: 'secondary' },
    { label: 'Im', value: 'imag', type: 'function', variant: 'secondary' },
    { label: '|z|', value: 'abs', type: 'function', variant: 'secondary' },
    { label: 'conj', value: 'conj', type: 'function', variant: 'secondary' },
    { label: 'arg', value: 'arg', type: 'function', variant: 'secondary' },
    { label: '→pol', value: 'topolar', type: 'function', variant: 'secondary' },
    { label: '→rec', value: 'torect', type: 'function', variant: 'secondary' },
  ],
  matrix: [
    { label: '[', value: '[', type: 'parenthesis', variant: 'secondary' },
    { label: ']', value: ']', type: 'parenthesis', variant: 'secondary' },
    { label: ';', value: ';', type: 'operator', variant: 'secondary' },
    { label: ',', value: ',', type: 'operator', variant: 'secondary' },
    { label: 'det', value: 'det', type: 'function', variant: 'secondary' },
    { label: 'inv', value: 'inv', type: 'function', variant: 'secondary' },
    { label: 'trans', value: 'transpose', type: 'function', variant: 'secondary' },
    { label: '×', value: '*', type: 'operator', variant: 'secondary' },
  ],
  converter: [
    { label: 'km', value: 'km', type: 'constant', variant: 'secondary' },
    { label: 'mi', value: 'miles', type: 'constant', variant: 'secondary' },
    { label: 'kg', value: 'kg', type: 'constant', variant: 'secondary' },
    { label: 'lb', value: 'lb', type: 'constant', variant: 'secondary' },
    { label: '°C', value: 'C', type: 'constant', variant: 'secondary' },
    { label: '°F', value: 'F', type: 'constant', variant: 'secondary' },
    { label: 'to', value: ' to ', type: 'operator', variant: 'secondary' },
    { label: 'GB', value: 'GB', type: 'constant', variant: 'secondary' },
  ],
};

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  mode,
  onInput,
  onAction,
  disabled,
  isFullscreen = false,
}) => {
  const handleClick = (config: ButtonConfig) => {
    if (disabled) return;
    
    if (config.type === 'action' && config.action) {
      onAction({ type: config.action });
    } else if (config.type === 'digit') {
      onInput({ type: 'digit', value: config.value });
    } else if (config.type === 'operator') {
      onInput({ type: 'operator', value: config.value });
    } else if (config.type === 'function') {
      onInput({ type: 'function', value: config.value });
    } else if (config.type === 'constant') {
      onInput({ type: 'constant', value: config.value });
    } else if (config.type === 'parenthesis') {
      onInput({ type: 'parenthesis', value: config.value as '(' | ')' });
    }
  };

  const extraFunctions = modeFunctions[mode] || [];

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'gap-4 lg:gap-6' : 'gap-3'}`}
         style={isFullscreen ? { height: '100%' } : undefined}>
      {/* Mode-specific function buttons */}
      {extraFunctions.length > 0 && (
        <div className={`flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm
                        ${isFullscreen ? 'p-4 lg:p-5 rounded-2xl' : 'p-3'}`}>
          <div className={`text-slate-500 font-semibold uppercase tracking-wider
                          ${isFullscreen ? 'text-sm mb-3' : 'text-xs mb-2'}`}>
            {mode} Functions
          </div>
          <div className={`grid grid-cols-4 ${isFullscreen ? 'gap-3 lg:gap-4' : 'gap-2'}`}>
            {extraFunctions.map((config, i) => (
              <CalcButton key={i} config={config} onClick={() => handleClick(config)} disabled={disabled} isFullscreen={isFullscreen} />
            ))}
          </div>
        </div>
      )}
      
      {/* MAIN KEYPAD - Always visible, fills remaining space in fullscreen */}
      <div className={`bg-white rounded-xl border border-slate-200 shadow-sm
                      ${isFullscreen ? 'flex-1 p-4 lg:p-5 rounded-2xl flex flex-col' : 'p-3'}`}
           style={isFullscreen ? { minHeight: 0 } : undefined}>
        <div className={`text-slate-500 font-semibold uppercase tracking-wider flex-shrink-0
                        ${isFullscreen ? 'text-sm mb-3' : 'text-xs mb-2'}`}>
          Keypad
        </div>
        <div className={`${isFullscreen ? 'flex-1 flex flex-col justify-between' : 'space-y-2'}`}
             style={isFullscreen ? { minHeight: 0 } : undefined}>
          {basicLayout.map((row, rowIndex) => (
            <div key={rowIndex} className={`grid grid-cols-4 ${isFullscreen ? 'gap-3 lg:gap-4 flex-1' : 'gap-2'}`}>
              {row.map((config, colIndex) => (
                <CalcButton key={colIndex} config={config} onClick={() => handleClick(config)} disabled={disabled} isFullscreen={isFullscreen} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Onboarding Component
 * 
 * Shows tooltips for first-time users to highlight key features.
 * Validates: Requirements 20.1, 20.2, 20.3
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const DEFAULT_STEPS: OnboardingStep[] = [
  {
    id: 'mode-switcher',
    title: 'Switch Calculator Modes',
    description: 'Click here to switch between Basic, Scientific, Programmer, and other calculator modes.',
    targetSelector: '[aria-label="Calculator modes"]',
    position: 'bottom',
  },
  {
    id: 'display',
    title: 'Expression Display',
    description: 'Your calculations appear here. Press Enter or = to evaluate.',
    targetSelector: '[aria-label="Calculator display"]',
    position: 'bottom',
  },
  {
    id: 'keypad',
    title: 'Calculator Keypad',
    description: 'Click buttons or use your keyboard to enter expressions.',
    targetSelector: '[aria-label="Calculator keypad"]',
    position: 'top',
  },
];

export interface OnboardingProps {
  steps?: OnboardingStep[];
  onComplete?: () => void;
}

export function Onboarding({
  steps = DEFAULT_STEPS,
  onComplete,
}: OnboardingProps): React.ReactElement | null {
  const [isComplete, setIsComplete] = useLocalStorage('calc_onboarding_complete', false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Show onboarding after a short delay for first-time users
  useEffect(() => {
    if (!isComplete) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isComplete]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      setIsComplete(true);
      setIsVisible(false);
      onComplete?.();
    }
  }, [currentStep, steps.length, setIsComplete, onComplete]);

  const handleSkip = useCallback(() => {
    setIsComplete(true);
    setIsVisible(false);
    onComplete?.();
  }, [setIsComplete, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Don't render if complete or not visible
  if (isComplete || !isVisible) {
    return null;
  }

  const step = steps[currentStep];
  if (!step) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleSkip}
        aria-hidden="true"
      />
      
      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl p-4 max-w-sm"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        role="dialog"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
      >
        {/* Progress indicator */}
        <div className="flex gap-1 mb-3">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h3 id="onboarding-title" className="text-lg font-semibold text-gray-900 mb-2">
          {step.title}
        </h3>
        <p id="onboarding-description" className="text-gray-600 mb-4">
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip tour
          </button>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Onboarding;

import React, { useState } from 'react';
import Button from '../Button';

interface Step {
  title: string;
  component: React.FC;
}

interface FormWizardProps {
  steps: Step[];
}

const FormWizard: React.FC<FormWizardProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)]">
          {steps[currentStep].title}
        </h3>
        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-[var(--color-primary)] rounded transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <CurrentStepComponent />
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FormWizard;
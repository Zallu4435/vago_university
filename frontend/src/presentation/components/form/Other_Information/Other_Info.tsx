import React, { useEffect, useState } from 'react';
import Other_Info_One from './Other_Info_One';
import { Other_Info_Two } from './Other_Info_Two';
import { HealthInfo, LegalInfo, OtherInformationSection } from '../../../../domain/types/formTypes';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

interface Props {
  initialData?: OtherInformationSection;
  onSave: (data: OtherInformationSection) => void;
}


const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => (
  <div className="max-w-4xl mx-auto mb-6">
    <div className="flex items-center justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index + 1 <= currentStep
                ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white'
                : 'bg-gray-100 text-gray-400'
              }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm ${index + 1 <= currentStep ? 'text-cyan-800' : 'text-gray-400'
              }`}>
              {index + 1 === 1 ? 'Health Information' : 'Legal Information'}
            </span>
          </div>
          {index < totalSteps - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${index + 1 < currentStep ? 'bg-cyan-400' : 'bg-gray-200'
              }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const Other_Info: React.FC<Props> = ({ initialData, onSave }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const [health, setHealth] = useState<HealthInfo>(initialData?.health || {
    medicalConditions: '',
    disabilities: '',
    specialNeeds: '',
  });

  const [legal, setLegal] = useState<LegalInfo>(initialData?.legal || {
    criminalRecord: '',
    legalProceedings: '',
  });

  useEffect(() => {
    onSave({ health, legal });
  }, [health, legal]);


  const handleNext = () => setStep(Math.min(step + 1, totalSteps));
  const handleBack = () => setStep(Math.max(step - 1, 1));

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-8 py-6">
      <StepIndicator currentStep={step} totalSteps={totalSteps} />

      {step === 1 && (
        <Other_Info_One
          value={health}
          onChange={setHealth}
          onNext={handleNext} />
      )}
      {step === 2 && (
        <Other_Info_Two
          value={legal}
          onChange={setLegal}
          onBack={handleBack}
          onNext={() => {
            onSave({ health, legal });
            console.log('Form completed');
          }}
        />
      )}
    </div>
  );
};

export default Other_Info;
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Other_Info_One from './Other_Info_One';
import Other_Info_Two from './Other_Info_Two';
import { OtherInformationFormData, OtherInformationSchema } from '../../../../domain/validation/OtherInfoSchema';
import { OtherInformationSection } from '../../../../domain/types/formTypes';

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
  const methods = useForm<OtherInformationFormData>({
    resolver: zodResolver(OtherInformationSchema),
    defaultValues: {
      health: {
        hasHealthSupport: initialData?.health?.hasHealthSupport ?? '',
        conditions: initialData?.health?.conditions ?? [],
        medicalConditions: initialData?.health?.medicalConditions ?? '',
        disabilities: initialData?.health?.disabilities ?? '',
        specialNeeds: initialData?.health?.specialNeeds ?? '',
      },
      legal: {
        hasCriminalRecord: initialData?.legal?.hasCriminalRecord ?? '',
        criminalRecord: initialData?.legal?.criminalRecord ?? '',
        legalProceedings: initialData?.legal?.legalProceedings ?? '',
      },
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger, formState: { errors }, watch } = methods;

  const [step, setStep] = React.useState(1);
  const totalSteps = 2;

  // console.log('Other_Info: Form values:', watch());

  const handleNext = async () => {
    const fieldsToValidate = step === 1 ? ['health'] : ['legal'];
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    console.log('Other_Info: Validation result:', { isValid, errors: JSON.stringify(errors, null, 2) });
    if (isValid) {
      setStep(Math.min(step + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep(Math.max(step - 1, 1));
  };

  const onSubmit = (data: OtherInformationFormData) => {
    console.log('Other_Info: Saving data:', data);
    onSave(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-screen-2xl mx-auto px-8 py-6">
        {errors.health?.message && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-sm text-red-700">{errors.health.message}</p>
          </div>
        )}
        {errors.legal?.message && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-sm text-red-700">{errors.legal.message}</p>
          </div>
        )}
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
        {step === 1 && (
          <Other_Info_One onNext={handleNext} />
        )}
        {step === 2 && (
          <Other_Info_Two
            onBack={handleBack}
            onNext={handleSubmit(onSubmit)}
          />
        )}
      </div>
    </FormProvider>
  );
};

export default Other_Info;
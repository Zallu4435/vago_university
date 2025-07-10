import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { InternationalSchoolInfo } from './InternationalSchoolInfo';
import { InternationalTestInfo } from './InternationalTestInfo';

export const InternationalEducation: React.FC = () => {
  const { formState: { errors }, trigger, handleSubmit } = useFormContext();
  const [step, setStep] = useState(1);

  const handleNext = async () => {
    console.log('InternationalEducation: handleNext called');
    // Validate only the school-related fields and subjects
    const fieldsToValidate = [
      'international.schoolName',
      'international.country',
      'international.from',
      'international.to',
      'international.examination',
      'international.examMonthYear',
      'international.resultType',
      'international.subjects',
    ];
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    console.log('InternationalEducation: Validation result:', { isValid, errors: JSON.stringify(errors, null, 2) });
    if (isValid) {
      console.log('InternationalEducation: Advancing to step 2');
      setStep(2);
    }
  };

  const handleBack = () => {
    console.log('InternationalEducation: handleBack called, returning to step 1');
    setStep(1);
  };

  const onSubmit = () => {
    console.log('InternationalEducation: onSubmit called');
    // Submission handled by parent Education component
  };

  return (
    <div className="w-full max-w-screen-2xl">
      <div className="bg-white shadow-sm rounded-xl border border-cyan-100">
        {errors.international?.message && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-sm text-red-700">{errors.international.message}</p>
          </div>
        )}
        {step === 1 && (
          <InternationalSchoolInfo onNext={handleNext} />
        )}
        {step === 2 && (
          <InternationalTestInfo onBack={handleBack} onSubmit={handleSubmit(onSubmit)} />
        )}
      </div>
    </div>
  );
};
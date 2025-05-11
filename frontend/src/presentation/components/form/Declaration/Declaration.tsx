import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../Button';
import { FormSubmissionFlow } from '../FormSubmissionFlow';
import { DeclarationSection } from '../../../../domain/types/formTypes';

interface DeclarationProps {
  value: DeclarationSection;
  onChange: (data: DeclarationSection) => void;
}

export const Declaration: React.FC<DeclarationProps> = ({ value, onChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, formState: { errors }, watch, getValues, setValue } = useFormContext();

  const agreements = watch('declaration') || value;

  const handleCheckboxChange = (field: keyof DeclarationSection, checked: boolean) => {
    const updatedAgreements = { ...agreements, [field]: checked };
    setValue('declaration', updatedAgreements, { shouldValidate: true });
    onChange(updatedAgreements);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      {!isSubmitting ? (
        <>
          <div className="p-6 space-y-6">
            {errors.declaration && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">Please complete all required declarations</p>
              </div>
            )}
            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded">
              <h3 className="text-lg font-medium text-cyan-900">Declaration</h3>
              <p className="text-sm text-cyan-800 mt-2">
                Please review and agree to the following terms to submit your application.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="privacyPolicy"
                  {...register('declaration.privacyPolicy')}
                  checked={agreements.privacyPolicy}
                  onChange={(e) => handleCheckboxChange('privacyPolicy', e.target.checked)}
                  className="mt-1 h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
                />
                <label htmlFor="privacyPolicy" className="ml-2 text-sm text-cyan-800">
                  I agree to the <a href="/privacy-notice" className="text-cyan-600 underline">Privacy Notice</a>.
                </label>
              </div>
              {errors.declaration?.privacyPolicy && (
                <p className="text-sm text-red-700 ml-6">{errors.declaration.privacyPolicy.message}</p>
              )}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="marketingEmail"
                  checked={agreements.marketingEmail}
                  onChange={(e) => handleCheckboxChange('marketingEmail', e.target.checked)}
                  className="mt-1 h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
                />
                <label htmlFor="marketingEmail" className="ml-2 text-sm text-cyan-800">
                  I consent to receive marketing emails about university programs and events.
                </label>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="marketingCall"
                  checked={agreements.marketingCall}
                  onChange={(e) => handleCheckboxChange('marketingCall', e.target.checked)}
                  className="mt-1 h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
                />
                <label htmlFor="marketingCall" className="ml-2 text-sm text-cyan-800">
                  I consent to receive marketing calls about university programs and events.
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between p-6 border-t border-cyan-100">
            <Button
              label="Previous"
              className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 px-4 py-2 rounded-lg"
              onClick={() => onChange(agreements)} // Trigger onChange to save current state
            />
            <Button
              label="Submit Application"
              disabled={!agreements.privacyPolicy || isSubmitting}
              onClick={() => setIsSubmitting(true)}
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </>
      ) : (
        <FormSubmissionFlow
          formData={getValues()}
          onConfirm={() => {
            setIsSubmitting(false);
            onChange(agreements); // Ensure state is saved before moving to summary
          }}
          onBackToForm={() => setIsSubmitting(false)}
          onPaymentComplete={() => {
            console.log('Declaration: Payment completed');
            onChange({ privacyPolicy: false, marketingEmail: false, marketingCall: false }); // Reset declaration
          }}
        />
      )}
    </div>
  );
};
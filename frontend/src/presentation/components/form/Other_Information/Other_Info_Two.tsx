import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../Button';
import { Textarea } from '../../Textarea';
import { radioOptions } from './options';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

export const Other_Info_Two: React.FC<Props> = ({ onBack, onNext }) => {
  const { register, watch, setValue, formState: { errors }, trigger } = useFormContext();
  const hasCriminalRecord = watch('legal.hasCriminalRecord');

  const handleCriminalRecordChange = (value: string) => {
    setValue('legal.hasCriminalRecord', value, { shouldValidate: true });
    setValue('legal.criminalRecord', value === 'true' ? '' : 'None', { shouldValidate: true });
  };

  const handleNext = async () => {
    console.log('Other_Info_Two: Current values before validation:', {
      hasCriminalRecord: watch('legal.hasCriminalRecord'),
      criminalRecord: watch('legal.criminalRecord'),
    });
    const isValid = await trigger('legal', { shouldFocus: true });
    console.log('Other_Info_Two: Validation result:', { 
      isValid, 
      errors: errors.legal ? JSON.stringify(errors.legal, null, 2) : 'No errors' 
    });
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Legal Information</h2>
        <p className="mt-1 text-sm text-cyan-700">Please provide accurate information about your legal history.</p>
      </div>

      <div className="p-6">
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
          <p className="text-sm text-cyan-800">
            Have you ever been arrested, charged in court, put on probation or convicted of an offence
            by a court of law or a military court (court martial) in any country or jurisdiction,
            suspended or expelled from an educational institution or terminated from your employment
            for any reason, or are there any court or disciplinary proceedings pending against you
            in any country or jurisdiction?*
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-cyan-700 mb-2">
            Select an option<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-6">
            {radioOptions.map(opt => (
              <div className="flex items-center" key={opt.label}>
                <input
                  type="radio"
                  id={`criminal_record_${opt.label.toLowerCase()}`}
                  {...register('legal.hasCriminalRecord', {
                    required: 'Please select whether you have a criminal record',
                  })}
                  value={String(opt.value)}
                  checked={hasCriminalRecord === String(opt.value)}
                  onChange={() => handleCriminalRecordChange(String(opt.value))}
                  className="form-radio h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
                />
                <label
                  htmlFor={`criminal_record_${opt.label.toLowerCase()}`}
                  className="ml-2 text-cyan-800"
                >
                  {opt.label}
                </label>
              </div>
            ))}
            {errors.legal?.hasCriminalRecord && (
              <p className="text-sm text-red-700 mt-2">{errors.legal.hasCriminalRecord.message}</p>
            )}
          </div>
        </div>

        {hasCriminalRecord === 'true' && (
          <>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 font-medium">
                    You have selected Yes. Please provide detailed information below.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Textarea
                id="criminal_details"
                label="Details of Conviction"
                {...register('legal.criminalRecord', {
                  required: 'Details are required if you have a criminal record',
                  maxLength: { value: 1000, message: 'Details cannot exceed 1000 characters' },
                })}
                placeholder="Please provide a full statement of the relevant information..."
                rows={5}
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.legal?.criminalRecord?.message}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-cyan-600">
                  Please be as detailed as possible
                </span>
                <span className="text-cyan-600">
                  Character Count: {watch('legal.criminalRecord')?.length || 0} / 1000
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between p-6 border-t border-cyan-100">
        <Button
          label="Previous"
          onClick={onBack}
          className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 px-4 py-2 rounded-lg transition-colors duration-300"
        />
        <Button
          label="Save and Next"
          onClick={handleNext}
          className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm"
        />
      </div>
    </div>
  );
};

export default Other_Info_Two;
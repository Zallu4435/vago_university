import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EducationFormData, educationSchema } from '../../../../domain/validation/EducationSchema';
import { LocalEducation } from './LocalEducation';
import { TransferEducation } from './TransferEducation';
import { InternationalEducation } from './InternationalEducation';
import { Select } from '../../Select';

const studentTypeOptions = [
  { value: 'local', label: 'Local' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'international', label: 'International' },
];

interface EducationProps {
  initialData?: EducationFormData;
  onSave: (data: EducationFormData) => void;
}

interface EducationRef {
  trigger: () => Promise<boolean>;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-50 text-red-700">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

export const Education = forwardRef<EducationRef, EducationProps>(({ initialData, onSave }, ref) => {
  const methods = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || {
      studentType: '',
      local: undefined,
      transfer: undefined,
      international: undefined,
    },
    mode: 'onChange',
  });

  const { control, formState: { errors }, setValue, trigger, watch, getValues } = methods;

  // Watch studentType to conditionally render sub-components
  const studentType = watch('studentType');

  // Save data when triggered by parent
  const handleSave = async () => {
    try {
      console.log('Education: handleSave called, form values:', getValues());
      const isValid = await trigger(); // Validate all fields
      console.log('Education: Validation result:', { isValid, errors: JSON.stringify(errors, null, 2) });
      if (isValid) {
        const data = getValues();
        console.log('Education: Saving data:', data);
        onSave(data);
        return true;
      }
      // Log specific error for international education
      if (errors.international?.message) {
        console.log('Education: International validation error:', errors.international.message);
      }
      return false;
    } catch (error) {
      console.error('Education: Validation error:', error);
      return false;
    }
  };

  // Expose trigger method to parent via ref
  useImperativeHandle(ref, () => ({
    trigger: handleSave,
  }));

  return (
    <ErrorBoundary>
      <FormProvider {...methods}>
        <div className="w-full max-w-screen-2xl mx-auto">
          <div className="bg-white shadow-sm rounded-xl border border-cyan-100 p-6">
            <h1 className="text-2xl font-semibold text-cyan-900 mb-6">Education Information</h1>

            {errors.studentType && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <p className="text-sm text-red-700">{errors.studentType.message}</p>
              </div>
            )}

            <div className="mb-6">
              <Controller
                name="studentType"
                control={control}
                render={({ field }) => (
                  <Select
                    id="studentType"
                    label="Student Type"
                    options={studentTypeOptions}
                    value={field.value}
                    onChange={(value) => {
                      console.log('Education: studentType changed to:', value);
                      field.onChange(value);
                      // Reset other fields to avoid validation conflicts
                      setValue('local', undefined);
                      setValue('transfer', undefined);
                      setValue('international', undefined);
                    }}
                    onBlur={field.onBlur}
                    required
                    placeholder="Select student type"
                    className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                    labelClassName="text-cyan-700"
                    error={errors.studentType?.message}
                  />
                )}
              />
            </div>

            {studentType === 'local' && <LocalEducation />}
            {studentType === 'transfer' && <TransferEducation />}
            {studentType === 'international' && <InternationalEducation />}
          </div>
        </div>
      </FormProvider>
    </ErrorBoundary>
  );
});

Education.displayName = 'Education';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../base/Input';
import { getNestedObjectError } from '../../../../shared/utils/formErrors';

interface TOEFLEssentialsSectionProps {
  label: string;
  prefix: 'toeflEssentials1' | 'toeflEssentials2';
}

const TOEFLEssentialsSection: React.FC<TOEFLEssentialsSectionProps> = ({ label, prefix }) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h3 className="text-lg font-medium text-cyan-900">{label}</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
            <span className="text-cyan-900">{label}</span>
          </div>
          <Controller
            name={`international.${prefix}.date`}
            control={control}
            render={({ field }) => (
              <Input
                name={`${prefix}Date`}
                id={`${prefix}Date`}
                label="Date Taken"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM/YYYY"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, `international.${prefix}`, 'date')}
              />
            )}
          />
          <Controller
            name={`international.${prefix}.grade`}
            control={control}
            render={({ field }) => (
              <Input
                name={`${prefix}Grade`}
                id={`${prefix}Grade`}
                label="Score"
                value={field.value}
                onChange={field.onChange}
                placeholder="Essential 1-12"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, `international.${prefix}`, 'grade')}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default TOEFLEssentialsSection;

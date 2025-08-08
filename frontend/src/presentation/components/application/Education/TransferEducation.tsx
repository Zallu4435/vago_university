import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../base/Input';
import { Select } from '../../base/Select';
import { Textarea } from '../../base/Textarea';
import { countryOptions, universityOptions } from './options';
import { getNestedObjectError } from '../../../../shared/utils/formErrors';

export const TransferEducation: React.FC = () => {
  const { control, formState: { errors }, watch } = useFormContext();
  const previousUniversity = watch('transfer.previousUniversity');

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Transfer Student Education</h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Controller
            name="transfer.schoolName"
            control={control}
            render={({ field }) => (
              <Input
                name="schoolName"
                id="schoolName"
                label="Name of School/Institution"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter school or institution name"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'schoolName')}
              />
            )}
          />
          <Controller
            name="transfer.country"
            control={control}
            render={({ field }) => (
              <Select
                name="country"
                id="country"
                label="Country"
                options={countryOptions}
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Select country"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'country')}
              />
            )}
          />
          <Controller
            name="transfer.from"
            control={control}
            render={({ field }) => (
              <Input
                name="from"
                id="from"
                label="From"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Start year"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'from')}
              />
            )}
          />
          <Controller
            name="transfer.to"
            control={control}
            render={({ field }) => (
              <Input
                name="to"
                id="to"
                label="To"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="End year"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'to')}
              />
            )}
          />
          <Controller
            name="transfer.previousUniversity"
            control={control}
            render={({ field }) => (
              <Select
                name="previousUniversity"
                id="previousUniversity"
                label="Previous University"
                options={universityOptions}
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Select university"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'previousUniversity')}
              />
            )}
          />
          {previousUniversity === 'other' && (
            <Controller
              name="transfer.otherUniversity"
              control={control}
              render={({ field }) => (
                <Input
                  name="otherUniversity"
                  id="otherUniversity"
                  label="Other University Name"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="Enter university name"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                  labelClassName="text-cyan-700"
                  error={getNestedObjectError(errors, 'transfer', 'otherUniversity')}
                />
              )}
            />
          )}
          <Controller
            name="transfer.creditsEarned"
            control={control}
            render={({ field }) => (
              <Input
                name="creditsEarned"
                id="creditsEarned"
                label="Credits Earned"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter credits earned"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'creditsEarned')}
              />
            )}
          />
          <Controller
            name="transfer.gpa"
            control={control}
            render={({ field }) => (
              <Input
                name="gpa"
                id="gpa"
                label="GPA"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter GPA"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'gpa')}
              />
            )}
          />
          <Controller
            name="transfer.programStudied"
            control={control}
            render={({ field }) => (
              <Input
                name="programStudied"
                id="programStudied"
                label="Program/Major Studied"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter program or major"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'transfer', 'programStudied')}
              />
            )}
          />
          <Controller
            name="transfer.reasonForTransfer"
            control={control}
            render={({ field }) => (
              <Textarea
                name="reasonForTransfer"
                id="reasonForTransfer"
                label="Reason for Transfer"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Explain your reason for transfer"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                rows={3}
                error={getNestedObjectError(errors, 'transfer', 'reasonForTransfer')}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

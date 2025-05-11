import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { countryOptions } from './options';

// Note: This component assumes it is rendered within a FormProvider context
// provided by a parent component (e.g., Education.tsx).
export const LocalEducation: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Local Student Education</h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Controller
            name="local.schoolName"
            control={control}
            render={({ field }) => (
              <Input
                id="schoolName"
                name="local.schoolName"
                label="Name of School/Institution"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter school or institution name"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.local?.schoolName?.message}
              />
            )}
          />
          <Controller
            name="local.country"
            control={control}
            render={({ field }) => (
              <Select
                id="country"
                name="local.country"
                label="Country"
                options={countryOptions}
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Select country"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.local?.country?.message}
              />
            )}
          />
          <Controller
            name="local.from"
            control={control}
            render={({ field }) => (
              <Input
                id="from"
                name="local.from"
                label="From"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Start year"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.local?.from?.message}
              />
            )}
          />
          <Controller
            name="local.to"
            control={control}
            render={({ field }) => (
              <Input
                id="to"
                name="local.to"
                label="To"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="End year"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.local?.to?.message}
              />
            )}
          />
          <Controller
            name="local.nationalID"
            control={control}
            render={({ field }) => (
              <Input
                id="nationalID"
                name="local.nationalID"
                label="National ID/Registration Number"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter national ID or registration number"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.local?.nationalID?.message}
              />
            )}
          />
          <Controller
            name="local.localSchoolCategory"
            control={control}
            render={({ field }) => (
              <Input
                id="localSchoolCategory"
                name="local.localSchoolCategory"
                label="School Category"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter school category"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.local?.localSchoolCategory?.message}
              />
            )}
          />
          <Controller
            name="local.stateOrProvince"
            control={control}
            render={({ field }) => (
              <Input
                id="stateOrProvince"
                name="local.stateOrProvince"
                label="State/Province"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter state or province"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.local?.stateOrProvince?.message}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
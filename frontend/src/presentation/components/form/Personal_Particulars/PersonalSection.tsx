import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { PhoneInput } from '../../PhoneInput';
import { PersonalFormData } from '../../../../domain/validation/PersonalFormSchema';
import { mainFields } from './options';

export const PersonalSection: React.FC = () => {
  const { formState: { errors } } = useFormContext<PersonalFormData>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
      {mainFields.map((field) =>
        field.type === 'select' ? (
          <div key={field.id} className="flex flex-col">
            <Select
              id={field.id}
              name={field.id}
              label={field.label}
              options={field.options}
              required={field.required}
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
            />
            {errors[field.id as keyof PersonalFormData]?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.id as keyof PersonalFormData]?.message}
              </p>
            )}
          </div>
        ) : (
          <div key={field.id} className="flex flex-col">
            <Input
              id={field.id}
              name={field.id}
              label={field.label}
              type={field.inputType || 'text'}
              required={field.required}
              placeholder={field.placeholder}
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
            />
            {errors[field.id as keyof PersonalFormData]?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.id as keyof PersonalFormData]?.message}
              </p>
            )}
          </div>
        )
      )}

      {/* Mobile Number Group */}
      <div className="flex flex-col">
        <PhoneInput
          countryName="mobileCountry"
          areaName="mobileArea"
          numberName="mobileNumber"
          label="Mobile"
          required={true}
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
        {(errors.mobileCountry?.message || errors.mobileArea?.message || errors.mobileNumber?.message) && (
          <div className="mt-1 space-y-1">
            {errors.mobileCountry?.message && (
              <p className="text-sm text-red-600">{errors.mobileCountry.message}</p>
            )}
            {errors.mobileArea?.message && (
              <p className="text-sm text-red-600">{errors.mobileArea.message}</p>
            )}
            {errors.mobileNumber?.message && (
              <p className="text-sm text-red-600">{errors.mobileNumber.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Home Telephone Group */}
      <div className="flex flex-col">
        <PhoneInput
          countryName="phoneCountry"
          areaName="phoneArea"
          numberName="phoneNumber"
          label="Home Telephone"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
        {(errors.phoneCountry?.message || errors.phoneArea?.message || errors.phoneNumber?.message) && (
          <div className="mt-1 space-y-1">
            {errors.phoneCountry?.message && (
              <p className="text-sm text-red-600">{errors.phoneCountry.message}</p>
            )}
            {errors.phoneArea?.message && (
              <p className="text-sm text-red-600">{errors.phoneArea.message}</p>
            )}
            {errors.phoneNumber?.message && (
              <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
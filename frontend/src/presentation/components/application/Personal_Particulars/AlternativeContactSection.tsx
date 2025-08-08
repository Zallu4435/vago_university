import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../base/Input';
import { Select } from '../../base/Select';
import { PhoneInput } from '../../base/PhoneInput';
import { PersonalFormData } from '../../../../domain/validation/PersonalFormSchema';
import { altContactFields } from './options';

export const AlternativeContactSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext<PersonalFormData>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
      {altContactFields.map((field) =>
        field.type === 'select' ? (
          <div key={field.id} className="flex flex-col">
            <Controller
              name={field.id as keyof PersonalFormData}
              control={control}
              render={({ field: { onChange, value, onBlur, ref } }) => (
                <Select
                  id={field.id}
                  name={field.id}
                  label={field.label}
                  options={field.options || []}
                  value={value as string}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={ref}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                  labelClassName="text-cyan-700"
                />
              )}
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

      <div className="flex flex-col">
        <PhoneInput
          countryName="altMobileCountry"
          areaName="altMobileArea"
          numberName="altMobileNumber"
          label="Mobile"
          required={true}
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
        {(errors.altMobileCountry?.message || errors.altMobileArea?.message || errors.altMobileNumber?.message) && (
          <div className="mt-1 space-y-1">
            {errors.altMobileCountry?.message && (
              <p className="text-sm text-red-600">{errors.altMobileCountry.message}</p>
            )}
            {errors.altMobileArea?.message && (
              <p className="text-sm text-red-600">{errors.altMobileArea.message}</p>
            )}
            {errors.altMobileNumber?.message && (
              <p className="text-sm text-red-600">{errors.altMobileNumber.message}</p>
            )}
          </div>
        )}
      </div>


      <div className="flex flex-col">
        <PhoneInput
          countryName="altPhoneCountry"
          areaName="altPhoneArea"
          numberName="altPhoneNumber"
          label="Home Telephone"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
        {(errors.altPhoneCountry?.message || errors.altPhoneArea?.message || errors.altPhoneNumber?.message) && (
          <div className="mt-1 space-y-1">
            {errors.altPhoneCountry?.message && (
              <p className="text-sm text-red-600">{errors.altPhoneCountry.message}</p>
            )}
            {errors.altPhoneArea?.message && (
              <p className="text-sm text-red-600">{errors.altPhoneArea.message}</p>
            )}
            {errors.altPhoneNumber?.message && (
              <p className="text-sm text-red-600">{errors.altPhoneNumber.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
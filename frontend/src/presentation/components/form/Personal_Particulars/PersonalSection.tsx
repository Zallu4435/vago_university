
// PersonalSection.tsx
import React from 'react';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { PhoneInput } from '../../PhoneInput';
import { PersonalInfo } from '../../../../domain/types/formTypes';
import {
  mainFields,
} from './options';

interface PersonalSectionProps {
  formData: PersonalInfo;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({ formData, onInputChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
    {mainFields.map((field) =>
      field.type === 'select' ? (
        <Select
          key={field.id}
          id={field.id}
          label={field.label}
          options={field.options}
          value={formData[field.id as keyof PersonalInfo] as string}
          onChange={onInputChange}
          required={field.required}
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
      ) : (
        <Input
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.inputType || 'text'}
          value={formData[field.id as keyof PersonalInfo] as string}
          onChange={onInputChange}
          required={field.required}
          placeholder={field.placeholder}
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white" 
          labelClassName="text-cyan-700"
        />
      )
    )}

    {/* Mobile Number Group */}
    <PhoneInput
      countryId="mobileCountry"
      areaId="mobileArea"
      numberId="mobileNumber"
      label="Mobile"
      countryValue={formData.mobileCountry}
      areaValue={formData.mobileArea}
      numberValue={formData.mobileNumber}
      onCountryChange={onInputChange}
      onAreaChange={onInputChange}
      onNumberChange={onInputChange}
      required
      className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
      labelClassName="text-cyan-700"
    />

    {/* Home Telephone Group */}
    <PhoneInput
      countryId="phoneCountry"
      areaId="phoneArea"
      numberId="phoneNumber"
      label="Home Telephone"
      countryValue={formData.phoneCountry}
      areaValue={formData.phoneArea}
      numberValue={formData.phoneNumber}
      onCountryChange={onInputChange}
      onAreaChange={onInputChange}
      onNumberChange={onInputChange}
      className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
      labelClassName="text-cyan-700"
    />
  </div>
);
// AlternativeContactSection.tsx
import React from 'react';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { PhoneInput } from '../../PhoneInput';
import { PersonalInfo } from '../../../../domain/types/formTypes';
import { altContactFields } from './options';

interface AlternativeContactSectionProps {
  formData: PersonalInfo;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const AlternativeContactSection: React.FC<AlternativeContactSectionProps> = ({
  formData,
  onInputChange,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
    {altContactFields.map((field) =>
      field.type === 'select' ? (
        <Select
          key={field.id}
          id={field.id}
          label={field.label}
          options={field.options}
          value={formData[field.id as keyof PersonalInfo] as string}
          onChange={onInputChange}
          placeholder={field.placeholder} // <-- add this
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
      ) : (
        <Input
          key={field.id}
          id={field.id}
          label={field.label}
          value={formData[field.id as keyof PersonalInfo] as string}
          onChange={onInputChange}
          placeholder={field.placeholder} // <-- add this
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
      )
    )}

    {/* Alternative Mobile Group */}
    <PhoneInput
      countryId="altMobileCountry"
      areaId="altMobileArea"
      numberId="altMobileNumber"
      label="Mobile"
      countryValue={formData.altMobileCountry}
      areaValue={formData.altMobileArea}
      numberValue={formData.altMobileNumber}
      onCountryChange={onInputChange}
      onAreaChange={onInputChange}
      onNumberChange={onInputChange}
      className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
      labelClassName="text-cyan-700"
    />

    {/* Alternative Home Telephone Group */}
    <PhoneInput
      countryId="altPhoneCountry"
      areaId="altPhoneArea"
      numberId="altPhoneNumber"
      label="Home Telephone"
      countryValue={formData.altPhoneCountry}
      areaValue={formData.altPhoneArea}
      numberValue={formData.altPhoneNumber}
      onCountryChange={onInputChange}
      onAreaChange={onInputChange}
      onNumberChange={onInputChange}
      className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
      labelClassName="text-cyan-700"
    />
  </div>
);
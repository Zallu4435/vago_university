import React from 'react';
import { Input } from './Input';

interface PhoneInputProps {
  countryId: string;
  areaId: string;
  numberId: string;
  label?: string;
  countryValue?: string;
  areaValue?: string;
  numberValue?: string;
  onCountryChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAreaChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  labelClassName?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryId,
  areaId,
  numberId,
  label,
  countryValue,
  areaValue,
  numberValue,
  onCountryChange,
  onAreaChange,
  onNumberChange,
  required = false,
  className = "",
  labelClassName = "",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex space-x-2">
        <div className="w-24">
          <Input
            id={countryId}
            placeholder="Country"
            value={countryValue}
            onChange={onCountryChange}
            required={required}
            className={className}
          />
        </div>
        <div className="w-24">
          <Input
            id={areaId}
            placeholder="Area"
            value={areaValue}
            onChange={onAreaChange}
            required={required}
            className={className}
          />
        </div>
        <div className="flex-1">
          <Input
            id={numberId}
            placeholder="Number"
            value={numberValue}
            onChange={onNumberChange}
            required={required}
            className={className}
          />
        </div>
      </div>
    </div>
  );
};
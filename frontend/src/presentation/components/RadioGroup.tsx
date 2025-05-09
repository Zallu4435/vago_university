import React from 'react';

interface RadioOption {
  label: string;
  value: string | boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  selectedValue: string | boolean | null;
  onChange: (value: string | boolean) => void;
  required?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  selectedValue,
  onChange,
  required = false,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <p className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
      )}
      <div className="flex space-x-4">
        {options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

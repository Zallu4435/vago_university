import React, { forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  name?: string;
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      name,
      label,
      options,
      value,
      onChange,
      onBlur,
      required,
      placeholder,
      className = '',
      labelClassName = '',
      error,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={id} className={`mb-2 text-sm font-medium ${labelClassName}`}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          id={id}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          ref={ref}
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${className} ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
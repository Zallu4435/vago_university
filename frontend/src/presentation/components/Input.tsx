import React from 'react';

interface InputProps {
  id: string;
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        // Move defaults first, then custom classes last for override
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${className}`}
      />
    </div>
  );
};
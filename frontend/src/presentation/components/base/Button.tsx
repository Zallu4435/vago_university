import React from 'react';

interface ButtonProps {
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | ''; 
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = 'button',
  variant = '',
  className = '',
}) => {
  const baseStyles = "py-2 px-4 rounded font-medium transition-colors";

  const variantStyles: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
    '': "", 
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant] || ''} ${className}`}
    >
      {label}
    </button>
  );
};
import { useState, useEffect } from 'react';

export const usePasswordStrength = (password: string) => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return 'bg-gray-200';
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return 'Enter a password';
      case 1:
        return 'Password is weak';
      case 2:
        return 'Password is fair';
      case 3:
        return 'Password is good';
      case 4:
        return 'Password is strong';
      default:
        return 'Enter a password';
    }
  };

  return { passwordStrength, getPasswordStrengthColor, getPasswordStrengthText };
};
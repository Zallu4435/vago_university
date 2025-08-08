import { FieldErrors } from 'react-hook-form';

export const getNestedError = (
  errors: FieldErrors<any>,
  path: string
): string | undefined => {
  const keys = path.split('.');
  let current: any = errors;
  
  for (const key of keys) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }
  
  if (current && typeof current === 'object' && 'message' in current) {
    return current.message;
  }
  
  return undefined;
};

export const getArrayError = (
  errors: FieldErrors<any>,
  path: string,
  index: number
): string | undefined => {
  const arrayPath = `${path}.${index}`;
  return getNestedError(errors, arrayPath);
};

export const getNestedObjectError = (
  errors: FieldErrors<any>,
  path: string,
  field: string
): string | undefined => {
  const fullPath = `${path}.${field}`;
  return getNestedError(errors, fullPath);
}; 
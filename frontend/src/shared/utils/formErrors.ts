import { FieldErrors, FieldValues } from 'react-hook-form';

export const getNestedError = <T extends FieldValues = FieldValues>(
  errors: FieldErrors<T>,
  path: string
): string | undefined => {
  const keys = path.split('.');
  let current: unknown = errors;
  
  for (const key of keys) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  if (current && typeof current === 'object' && 'message' in current) {
    return (current as { message: string }).message;
  }
  
  return undefined;
};

export const getArrayError = <T extends FieldValues = FieldValues>(
  errors: FieldErrors<T>,
  path: string,
  index: number
): string | undefined => {
  const arrayPath = `${path}.${index}`;
  return getNestedError(errors, arrayPath);
};

export const getNestedObjectError = <T extends FieldValues = FieldValues>(
  errors: FieldErrors<T>,
  path: string,
  field: string
): string | undefined => {
  const fullPath = `${path}.${field}`;
  return getNestedError(errors, fullPath);
}; 
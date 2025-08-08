import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../base/Input';
import { Select } from '../../base/Select';

export type TestField = {
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  type?: 'input' | 'select';
  error?: string;
};

const TestRow: React.FC<{ fields: TestField[] }> = ({ fields }) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-6">
      {fields.map((field) => (
        <Controller
          key={field.id}
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            field.type === 'select' ? (
              <Select
                id={field.id}
                label={field.label}
                value={controllerField.value}
                onChange={controllerField.onChange}
                options={field.options || []}
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={field.error}
              />
            ) : (
              <Input
                name={field.name}
                id={field.id}
                label={field.label}
                value={controllerField.value}
                onChange={controllerField.onChange}
                placeholder={field.placeholder}
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={field.error}
              />
            )
          )}
        />
      ))}
    </div>
  );
};

export default TestRow;
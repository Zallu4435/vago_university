import { Input } from '../../Input';
import { Select } from '../../Select';

export type TestField = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  type?: 'input' | 'select';
};

const TestRow: React.FC<{ fields: TestField[] }> = ({ fields }) => (
  <div className="grid grid-cols-2 gap-6">
    {fields.map((field) => (
      <div key={field.id}>
        {field.type === 'select' ? (
          <Select
            id={field.id}
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            options={field.options || []}
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
        ) : (
          <Input
            id={field.id}
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
        )}
      </div>
    ))}
  </div>
);

export default TestRow;
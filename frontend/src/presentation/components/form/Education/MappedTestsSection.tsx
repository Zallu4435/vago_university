import React from 'react';
import { useFormContext } from 'react-hook-form';
import TestRow from './TestRow';
import { testConfigs } from './options';

const MappedTestsSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      {testConfigs.map((test) => (
        <div className="bg-white rounded-lg border border-cyan-100 overflow-hidden" key={test.testName}>
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
            <h3 className="text-lg font-medium text-cyan-900">{test.testName}</h3>
          </div>
          <div className="p-6">
            <TestRow
              fields={test.fields.map(field => ({
                ...field,
                name: `international.${test.testName.toLowerCase()}.${field.id}`,
                error: errors.international?.[test.testName.toLowerCase()]?.[field.id]?.message,
              }))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MappedTestsSection;
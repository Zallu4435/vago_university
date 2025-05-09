import React, { useState } from 'react';
import { Select } from '../../Select';
import { LocalEducation } from './LocalEducation';
import { TransferEducation } from './TransferEducation';
import { InternationalEducation } from './InternationalEducation';
import { studentTypeOptions } from './options';

export const Education: React.FC = () => {
  const [studentType, setStudentType] = useState('local');

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100 mb-8">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <h2 className="text-xl font-semibold text-cyan-900">Education Details</h2>
        </div>

        <div className="p-8">
          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
            <p className="text-sm text-cyan-800">
              Please select your student type to proceed with the relevant education details.
            </p>
          </div>

          <Select
            id="studentType"
            label="Student Type"
            options={studentTypeOptions}
            value={studentType}
            onChange={e => setStudentType(e.target.value)}
            required
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
        </div>
      </div>

      <div className="transition-all duration-300">
        {studentType === 'local' && <LocalEducation />}
        {studentType === 'transfer' && <TransferEducation />}
        {studentType === 'international' && <InternationalEducation />}
      </div>
    </div>
  );
};
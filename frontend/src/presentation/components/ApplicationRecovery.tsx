// presentation/components/application/ApplicationRecovery.tsx

import React, { useState } from 'react';
import { isValidUUID } from '../../frameworks/utils/uuid';

interface ApplicationRecoveryProps {
  onRecoverApplication: (applicationId: string) => void;
}

export const ApplicationRecovery: React.FC<ApplicationRecoveryProps> = ({ onRecoverApplication }) => {
  const [applicationId, setApplicationId] = useState('');
  const [error, setError] = useState('');

  const handleRecovery = () => {
    if (!applicationId.trim()) {
      setError('Please enter an application ID');
      return;
    }

    if (!isValidUUID(applicationId.trim())) {
      setError('Please enter a valid application ID');
      return;
    }

    setError('');
    onRecoverApplication(applicationId.trim());
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-cyan-100">
      <h2 className="text-xl font-bold text-cyan-800 mb-4">Resume an Existing Application</h2>
      <p className="text-cyan-700 mb-4">
        If you have previously started an application and saved your Application ID, enter it below to continue.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={applicationId}
            onChange={(e) => {
              setApplicationId(e.target.value);
              setError('');
            }}
            placeholder="Enter your Application ID"
            className="w-full px-4 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          onClick={handleRecovery}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Recover Application
        </button>
      </div>
      
      <div className="mt-4 text-sm text-cyan-600">
        <p>
          Don't have an Application ID? Start a new application and we'll generate one for you.
        </p>
      </div>
    </div>
  );
};  
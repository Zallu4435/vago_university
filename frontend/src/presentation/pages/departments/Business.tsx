import React from 'react';
import { Outlet } from 'react-router-dom';

const Business: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">School of Business</h1>
          <p className="text-xl opacity-90">
            Excellence in business education and research, preparing future leaders for global success.
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Business; 
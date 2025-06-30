import React from 'react';
import { Outlet } from 'react-router-dom';

const Business: React.FC = () => {
  return (
    <div className="py-4 sm:py-6 lg:py-8 xl:py-12 bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Business; 
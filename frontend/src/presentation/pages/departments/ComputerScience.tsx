import React from 'react';
import { Outlet } from 'react-router-dom';

const ComputerScience: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ComputerScience;
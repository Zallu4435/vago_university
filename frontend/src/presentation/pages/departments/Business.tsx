import React from 'react';
import { Outlet } from 'react-router-dom';

const Business: React.FC = () => {
  return (
    <div className="py-12">
        <Outlet />
    </div>
  );
};

export default Business; 
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 ">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
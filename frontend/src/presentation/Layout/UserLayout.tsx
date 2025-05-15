import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-cyan-600 text-white p-4">
        <h1 className="text-xl font-bold">Horizon University - Student Portal</h1>
        <nav className="mt-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `mr-4 ${isActive ? 'underline' : 'hover:underline'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/canvas"
            className={({ isActive }) =>
              `mr-4 ${isActive ? 'underline' : 'hover:underline'}`
            }
          >
            Canvas
          </NavLink>
        </nav>
      </header>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
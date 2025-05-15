import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const FacultyLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Faculty Portal</h1>
        <nav>
          <NavLink
            to="/faculty/courses"
            className={({ isActive }) =>
              `block py-2 px-4 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-blue-700'}`
            }
          >
            Courses
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default FacultyLayout;
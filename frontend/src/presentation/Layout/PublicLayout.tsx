import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background-light)] [data-theme=dark]:bg-[var(--color-background-dark)] [data-theme=sepia]:bg-[var(--color-background-sepia)] [data-theme=high-contrast]:bg-[var(--color-background-high-contrast)]">
      <header className="bg-[var(--color-primary)] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">University Management Platform</h1>
          <nav className="flex space-x-4 items-center">
            <NavLink
              to="/apply"
              className={({ isActive }) =>
                `text-white hover:text-gray-200 ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              Apply
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `text-white hover:text-gray-200 ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-white hover:text-gray-200 ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              Login
            </NavLink>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-200 [data-theme=dark]:bg-gray-700 [data-theme=sepia]:bg-[var(--color-background-sepia)] [data-theme=high-contrast]:bg-black text-center p-4">
        <p className="text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)]">
          © 2025 University Management Platform. All rights reserved.
        </p>
        <p className="text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)]">
          Contact: support@universityplatform.com
        </p>
      </footer>
    </div>
  );
};

export default PublicLayout;
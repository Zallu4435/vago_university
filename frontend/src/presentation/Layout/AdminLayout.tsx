import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 flex justify-between items-center px-6 py-3">
          <h1 className="text-xl font-semibold text-gray-800">University Admin Platform</h1>
          <button className="border border-gray-300 rounded px-4 py-1 text-sm hover:bg-gray-100">
            Log Out
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
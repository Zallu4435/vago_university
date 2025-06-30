import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar'; // Adjust the path as needed
import DepartmentFooter from '../components/departments/DepartmentFooter';
import { Header } from '../components/Header';

// Change from named export to default export
const DepartmentLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32">
      <Header layoutType='department'/>
      <Navbar layoutType="department" />
      <main className="flex-1 pb-4 sm:pb-6 md:pb-8 lg:pb-12 mt-8 sm:mt-6 md:mt-8 lg:mt-12">
        <Outlet />
      </main>
      <DepartmentFooter />
    </div>
  );
};

// Use default export
export default DepartmentLayout;
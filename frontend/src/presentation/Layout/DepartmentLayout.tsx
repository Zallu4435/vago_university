import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar'; // Adjust the path as needed
import DepartmentFooter from '../components/departments/DepartmentFooter';
import { Header } from '../components/Header';

// Change from named export to default export
const DepartmentLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-[120px] sm:pt-[125px] md:pt-[130px] lg:pt-[135px]">
      <Header layoutType='department'/>
      <Navbar layoutType="department" />
      <main className="flex-1 pb-8 sm:pb-12 md:pb-16">
        <Outlet />
      </main>
      <DepartmentFooter />
    </div>
  );
};

// Use default export
export default DepartmentLayout;
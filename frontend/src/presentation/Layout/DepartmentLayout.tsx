import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/public/Navbar'; 
import DepartmentFooter from '../components/departments/common/DepartmentFooter';
import { Header } from '../components/public/Header';

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

export default DepartmentLayout;
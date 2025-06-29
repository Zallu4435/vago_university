import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/main/Footer';

const UGLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-[120px] sm:pt-[125px] md:pt-[130px] lg:pt-[135px]">
      <Header layoutType='ug'/>
      <Navbar layoutType="ug" />
      <main className="flex-1 pb-8 sm:pb-12 md:pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UGLayout;
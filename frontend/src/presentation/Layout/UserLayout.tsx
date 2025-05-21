import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from '../pages/user/Header';
import Footer from '../pages/user/Footer';

const UserLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <main className="flex-grow">
        <Outlet context={[activeTab, setActiveTab]} />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
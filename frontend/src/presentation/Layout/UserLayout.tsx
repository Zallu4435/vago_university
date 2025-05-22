import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Header from '../pages/user/Header';
import Footer from '../pages/user/Footer';
import { logout } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const UserLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const profilePicture = user?.profilePicture;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    dispatch(logout());
    navigate('/login')
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        onLogout={handleLogout} 
        userName={fullName}
        profilePicture={profilePicture}
      />
      <main className="flex-grow">
        <Outlet context={[activeTab, setActiveTab]} />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
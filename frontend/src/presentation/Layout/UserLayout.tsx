import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../pages/user/Header';
import Footer from '../pages/user/Footer';
import { logout } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const UserLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isSettingsPage = location.pathname === '/settings';

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const profilePicture = user?.profilePicture;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
      {/* Background layers for glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {!isSettingsPage && (
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            onLogout={handleLogout}
            userName={fullName}
            profilePicture={profilePicture}
          />
        )}
        <main className={`flex-grow container mx-auto px-4 ${isSettingsPage ? '' : 'py-12'}`}>
          <Outlet context={[activeTab, setActiveTab]} />
        </main>
        {!isSettingsPage && <Footer />}
      </div>
    </div>
  );
};

export default UserLayout;
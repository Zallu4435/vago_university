import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/main/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { RootState } from '../redux/store';

const PublicLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50 pt-[120px] sm:pt-[125px] md:pt-[130px] lg:pt-[135px]">
      <Header userName={fullName} onLogout={handleLogout} isAuthenticated={!!user} layoutType='public' />
      <Navbar layoutType="public" />
      <main className="flex-1 pb-8 sm:pb-12 md:pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
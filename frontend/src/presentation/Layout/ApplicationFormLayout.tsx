import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Header } from '../components/Header';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const ApplicationFormLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName={fullName}
        isAuthenticated={!!user}
        layoutType="public"
        hideNavLinks
        onLogout={handleLogout}
      />
      <main className="mt-28">
        {children}
      </main>
    </div>
  );
};

export default ApplicationFormLayout; 
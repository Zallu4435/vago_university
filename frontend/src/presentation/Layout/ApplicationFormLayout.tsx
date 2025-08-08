import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../appStore/store';
import { Header } from '../components/public/Header';
import { logout } from '../../appStore/authSlice';
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
      <main className="mt-24 sm:mt-26 md:mt-28 lg:mt-30">
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, { onLogout: handleLogout })
            : child
        )}
      </main>
    </div>
  );
};

export default ApplicationFormLayout; 